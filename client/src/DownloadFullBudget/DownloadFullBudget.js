import React, { useContext, useEffect, useState } from "react";
import YearContext from "../contexts/year/YearContext";
import AlertContext from "../contexts/alert/AlertContext";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";

function DownloadFullBudget({ props }) {
  const { summary, type,budget } = props;
  const sheetTables = [[]],
    dp = [""],
    ip = [];
  const statusArr = [
    "Indent in Process",
    "Indent Payment Done",
    "Entry Deleted",
  ];
  const dirArr = ["Direct Purchased", "Entry Deleted"];
  // const [budget, setBudget] = useState({ consumable: [], equipment: [] });

  const { unSuccessful } = useContext(AlertContext);
  const { year } = useContext(YearContext);

  // const fetchData = async () => {
  //   const response = await fetch(
  //     `${process.env.REACT_APP_API_HOST}/api/budget/fetchcompletebudget?year=${year}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "auth-token": localStorage.getItem("authToken"),
  //       },
  //     }
  //   );
  //   const json = await response.json();
  //   if (json.error) unSuccessful(json.error);
  //   else {
  //     setBudget(json);
  //   }
  // };


  // useEffect(
  //   () => fetchData,
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   []
  // );
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

  const createSheets = async (budget) => {
    const { name, indents, total, totalBudget } = budget;
    const { inProcess, directPur } = indents;
    ip.push(inProcess.length);
    dp.push(directPur.length);
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
      console.log(`reached ${i}`)
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
    sheetTables.push(finalTable);
    const sheet = XLSX.utils.json_to_sheet(finalTable, {
      skipHeader: true,
    });
    return sheet;
  };

  const createSummary = (summary) => {
    const title = [
      { A: "INDIAN INSTITUTE OF TECHNOLOGY INDORE" },
      {},
      {
        A: `SUMMARY OF ${
          type ? "EQUIPMENT" : "CONSUMABLE"
        } BUDGET FOR THE FINANCIAL YEAR ${year}-${(year % 100) + 1}`,
      },
      {},
    ];

    const table = [
      {
        A: "Sr. No.",
        B: "Department",
        C: "Budget Allocated",
        D: "Expenditure",
        E: "Indents in Process",
        F: "Fund Available",
        G: "%Utilised",
      },
    ];
    summary.forEach((dept, i) => {
      
      const { name, budget, expenditure, in_process } = dept;
      table.push({
        A: i,
        B: name,
        C: budget,
        D: expenditure,
        E: in_process,
        F: budget - expenditure,
        G: `${((expenditure / budget) * 100).toFixed(2)}%`,
      });
    });
    ip.push(summary.length);
    const finalTable = [...title, ...table];
    const sheet = XLSX.utils.json_to_sheet(finalTable, {
      skipHeader: true,
    });
    return sheet;
  };

  const handleExport = async () => {
    const wb = XLSX.utils.book_new();
    const sheet = createSummary(summary);
    XLSX.utils.book_append_sheet(wb, sheet, "summary");
    if (type) {
      for (let i = 0; i < budget.equipment.length; i++) {
        const dept = budget.equipment[i];
        const {
          department,
          indents_process,
          expenditure,
          in_process,
          username,
          direct_purchase,
        } = dept;
        let bud = {
          name: department,
          indents: { inProcess: indents_process, directPur: direct_purchase },
          total: { expenditure, inProcess: in_process },
          totalBudget: dept.budget,
        };
        const sheet = await createSheets(bud);
        XLSX.utils.book_append_sheet(wb, sheet, username);
      }
    } else {
      for (let i = 0; i < budget.consumable.length; i++) {
        const dept = budget.consumable[i];
        const {
          department,
          indents_process,
          expenditure,
          in_process,
          username,
          direct_purchase,
        } = dept;
        let bud = {
          name: department,
          indents: { inProcess: indents_process, directPur: direct_purchase },
          total: { expenditure, inProcess: in_process },
          totalBudget: dept.budget,
        };
        const sheet = await createSheets(bud);
        XLSX.utils.book_append_sheet(wb, sheet, username);
      }
    }

    const workbookBlob = worbook2blob(wb);
    return addStyles(workbookBlob);
  };

  const addStyles = async (workbookBlob) => {
    const workbook = await XlsxPopulate.fromDataAsync(workbookBlob);
    workbook.sheets().forEach((sheet, ind) => {
      const dataInfo = {
        iiti: "A1",
        iitiRange: ind ? "A1:K1" : "A1:G1",
        budgetRange: ind ? "A3:K3" : "A3:G3",
        deptRange: ind ? "A4:K4" : "A4:G4",
        totalRange: ind
          ? [
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
            ]
          : [],
        table0Range: ind ? "A6:J7" : null,
        tableHead: [],
        table12Range: [],
      };
      sheetTables[ind].forEach((data, index) => {
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
              index + 2 + (dataInfo.table12Range.length ? dp[ind] : ip[ind])
            }`
          );
        }
      });
      if (ind) {
        for (let j = 65; j <= 75; j++) {
          const i = String.fromCharCode(j);
          if (i === "K" || i === "D") sheet.column(i).width(26);
          else if (i === "B") sheet.column(i).width(21);
          else if (i === "C" || i === "F" || i === "I" || i === "J")
            sheet.column(i).width(16);
          else sheet.column(i).width(11);
        }
      } else {
        for (let j = 66; j <= 71; j++) {
          const i = String.fromCharCode(j);
          if (j === 66) sheet.column("B").width(40);
          else sheet.column(i).width(20);
          dataInfo.tableHead.push("A5:G5");
          dataInfo.table12Range.push(`A6:G${ip.length + 4}`);
        }
      }
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
      if (dataInfo.table0Range)
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
      dataInfo.table12Range.forEach((element) => {
        sheet.range(element).style({
          fill: "EFEFEF",
          border: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });
      });
      for (let i = 0; i <= dp[ind]; i++) {
        const idx = i + ip[ind] + 15;
        sheet.range(`I${idx}:J${idx}`).merged(true);
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
    downloadNode.setAttribute(
      "download",
      `${type === 1 ? "equip" : "consum"}${year % 100}-${
        (year % 100) + 1
      }_${fileName}.xlsx`
    );
    downloadNode.click();
    downloadNode.remove();
  };
  return <button onClick={downloadExcel}>Download Excel File</button>;
}

export default DownloadFullBudget;