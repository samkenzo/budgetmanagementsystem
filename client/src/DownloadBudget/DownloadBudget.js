import React from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";

const DownloadBudget = ({ budget }) => {
  const { year, department, indents, total, totalBudget } = budget;
  const { name, type } = department;
  const { inProcess, directPurchase } = indents;
  const statusArr = ["Indent in Process", "Indent Payment Done"];

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
        D: "",
        G: totalBudget - total.expenditure,
        F: "",
        I: `${((total.expenditure * 100) / totalBudget).toFixed(2)}%`,
      },
      {},
    ];

    let table1 = [
      {
        A: "Sr.No.",
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
    table1 = [{ A: "Indents" }].concat(table1);
    const finalTable = [...title, ...table0, ...table1];

    const wb = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(finalTable, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, sheet, "Indents");
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
      tableType: [
        "A9",
        "K9",
        `A${inProcess.length + 13}:K${inProcess.length + 13}`,
      ],
    };
    return addStyles(workbookBlob, dataInfo);
  };

  const addStyles = async (workbookBlob, dataInfo) => {
    const workbook = await XlsxPopulate.fromDataAsync(workbookBlob);
    workbook.sheets().forEach((sheet) => {
      for (let j = 65; j <= 75; j++) {
        const i = String.fromCharCode(j);
        if (i === "K") sheet.column(i).width(25);
        else if (i === "B" || i == "D") sheet.column(i).width(20);
        else if (i == "C" || i === "F" || i === "I" || i == "J")
          sheet.column(i).width(15);
        else sheet.column(i).width(10);

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
          console.log(element);
          sheet
            .range(element)
            .merged(true)
            .style({
              bold: element[1] == "6",
              horizontalAlignment: "center",
              verticalAlignment: "center",
            });
        });
        sheet
          .range(dataInfo.table0Range)
          .style({ border: true, fill: "DBDBDB" });
      }
    });
    workbookBlob = await workbook.outputAsync();
    return URL.createObjectURL(workbookBlob);
  };

  const downloadExcel = async () => {
    const url = await handleExport();
    const downloadNode = document.createElement("a");
    downloadNode.setAttribute("href", url);
    downloadNode.setAttribute("download", "hello.xlsx");
    downloadNode.click();
    downloadNode.remove();
  };

  return <button onClick={downloadExcel}>Download Excel File</button>;
};

export default DownloadBudget;