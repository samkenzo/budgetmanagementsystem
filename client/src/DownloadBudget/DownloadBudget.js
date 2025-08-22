import React from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";

const DownloadBudget = ({ budget }) => {
  const { year, department, indents, total, totalBudget } = budget;
  const { name, type, username } = department;
  const { inProcess, directPur } = indents;
  const statusArr = [
    "Indent in Process",
    "Indent Payment Done",
    "Entry Deleted",
  ];
  const dirArr = ["Direct Purchased", "Entry Deleted"];

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i);
    return buf;
  };

  const worbook2blob = (workbook) => {
    const wopts = { bookType: "xlsx", type: "binary" };
    const wbout = XLSX.write(workbook, wopts);
    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });
    return blob;
  };

  const handleExport = () => {
    const title = [
      { A: "INDIAN INSTITUTE OF TECHNOLOGY INDORE" },
      {},
      {
        A: `DETAILS OF ${
          type ? "EQUIPMENT" : "CONSUMABLE"
        } BUDGET FOR THE FINANCIAL YEAR ${year}-${(year % 100) + 1}`,
      },
      { A: name.toUpperCase() },
      {},
    ];

    let table0 = [
      {
        A: "Total Budget",
        B: "",
        C: "Expenditure",
        D: "",
        E: "Indents in Process",
        F: "",
        G: "Fund Available",
        H: "",
        I: "Percent Utilised",
      },
      {
        A: totalBudget,
        B: "",
        C: total.expenditure,
        D: "",
        E: total.inProcess,
        F: "",
        G: totalBudget - total.expenditure,
        H: "",
        I: `${((total.expenditure * 100) / totalBudget).toFixed(2)}%`,
      },
      {},
      {},
    ];

    let table1 = [
      {
        A: "Sr. No.",
        B: "Status",
        C: "Entry Date",
        D: "Particulars",
        E: "Year",
        F: "Indenter",
        G: "Indent No.",
        H: "PONo.",
        I: "Indent Amount",
        J: "Final Amount",
        K: "Remarks",
      },
    ];
    let i = 1;
    inProcess.forEach((entry) => {
      const {
        entry_date,
        particulars,
        indenter,
        indent_no,
        po_no,
        indent_amount,
        amount,
        remark,
        status,
      } = entry;
      table1.push({
        A: i++,
        B: statusArr[status],
        C: new Date(entry_date).toDateString(),
        D: particulars,
        E: `${year}-${(year % 100) + 1}`,
        F: indenter,
        G: indent_no,
        H: po_no,
        I: indent_amount,
        J: amount,
        K: remark,
      });
    });

    let table2 = [
      {
        A: "Sr. No.",
        B: "Status",
        C: "Entry Date",
        D: "Particulars",
        E: "Year",
        F: "Indenter",
        G: "Indent No.",
        H: "Amount",
        I: "Remarks",
      },
    ];
    i = 1;
    directPur.forEach((entry) => {
      const {
        entry_date,
        particulars,
        indenter,
        indent_no,
        amount,
        remark,
        status,
      } = entry;
      table2.push({
        A: i++,
        B: dirArr[status],
        C: new Date(entry_date).toDateString(),
        D: particulars,
        E: `${year}-${(year % 100) + 1}`,
        F: indenter,
        G: indent_no,
        H: amount,
        I: remark,
      });
    });

    table1 = [{ A: "Indents" }].concat(table1);
    table2 = [{ A: "Direct Purchases" }].concat(table2);
    const finalTable = [...title, ...table0, ...table1, {}, {}, ...table2];

    const wb = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(finalTable, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, sheet, username);
    const workbookBlob = worbook2blob(wb);
    const dataInfo = {
      iiti: "A1",
      iitiRange: "A1:K1",
      budgetRange: "A3:K3",
      deptRange: "A4:K4",
      totalRange: [
        "A6:B6",
        "C6:D6",
        "E6:F6",
        "G6:H6",
        "I6:J6",
        "A7:B7",
        "C7:D7",
        "E7:F7",
        "G7:H7",
        "I7:J7",
      ],
      table0Range: "A6:J7",
      tableHead: [],
      table12Range: [],
    };
    finalTable.forEach((data, index) => {
      if (data["A"] === "Indents" || data["A"] === "Direct Purchases") {
        dataInfo.tableHead.push(
          `A${index + 1}:${dataInfo.tableHead.length ? "J" : "K"}${index + 1}`
        );
        dataInfo.tableHead.push(
          `A${index + 2}:${dataInfo.tableHead.length > 1 ? "J" : "K"}${
            index + 2
          }`
        );
        dataInfo.table12Range.push(
          `A${index + 3}:${dataInfo.table12Range.length ? "J" : "K"}${
            index +
            2 +
            (dataInfo.table12Range.length ? directPur.length : inProcess.length)
          }`
        );
      }
    });
    return addStyles(workbookBlob, dataInfo);
  };

  const addStyles = async (workbookBlob, dataInfo) => {
    const workbook = await XlsxPopulate.fromDataAsync(workbookBlob);
    workbook.sheets().forEach((sheet) => {
      for (let j = 65; j <= 75; j++) {
        const i = String.fromCharCode(j);
        if (i === "K" || i === "D") sheet.column(i).width(26);
        else if (i === "B") sheet.column(i).width(21);
        else if (i === "C" || i === "F" || i === "I" || i === "J")
          sheet.column(i).width(16);
        else sheet.column(i).width(11);

        sheet.range(dataInfo.iitiRange).merged(true).style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          fontSize: 15,
        });
        sheet.range(dataInfo.budgetRange).merged(true).style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          fontSize: 12,
        });
        sheet.range(dataInfo.deptRange).merged(true).style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          fontSize: 12,
        });
        dataInfo.totalRange.forEach((element) => {
          sheet
            .range(element)
            .merged(true)
            .style({
              bold: element[1] === "6",
              horizontalAlignment: "center",
              verticalAlignment: "center",
            });
        });
        sheet
          .range(dataInfo.table0Range)
          .style({ border: true, fill: "DBDBDB" });
        dataInfo.tableHead.forEach((element, index) => {
          sheet
            .range(element)
            .merged(index % 2 === 0)
            .style({
              bold: true,
              border: true,
              fill: "F4F3AB",
              horizontalAlignment: "center",
              verticalAlignment: "center",
              fontSize: 12,
            });
        });
        dataInfo.table12Range.forEach((element, index) => {
          sheet.range(element).style({
            fill: "EFEFEF",
            border: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
          });
        });
        for (let i = 0; i <= directPur.length; i++) {
          const idx = i + inProcess.length + 15;
          sheet.range(`I${idx}:J${idx}`).merged(true);
        }
      }
    });
    workbookBlob = await workbook.outputAsync();
    return URL.createObjectURL(workbookBlob);
  };

  const downloadExcel = async () => {
    const url = await handleExport();
    const downloadNode = document.createElement("a");
    downloadNode.setAttribute("href", url);
    const currentDate = new Date();
    const fileName = `budget_${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
    console.log(fileName);
    downloadNode.setAttribute(
      "download",
      `${username}${year % 100}-${(year % 100) + 1}_${fileName}.xlsx`
    );
    downloadNode.click();
    downloadNode.remove();
  };

  return <button onClick={downloadExcel}>Download Excel File</button>;
};

export default DownloadBudget;