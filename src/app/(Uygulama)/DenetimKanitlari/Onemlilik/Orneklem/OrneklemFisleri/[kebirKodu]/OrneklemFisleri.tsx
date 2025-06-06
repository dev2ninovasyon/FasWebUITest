import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { dictionary } from "@/utils/languages/handsontable.tr-TR";
import "handsontable/dist/handsontable.full.min.css";
import { plus } from "@/utils/theme/Typography";
import { useDispatch, useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { Grid, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { enqueueSnackbar } from "notistack";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { setCollapse } from "@/store/customizer/CustomizerSlice";
import {
  updateEDefterIncelemeListeVerisi,
  updateEDefterIncelemeVerisi,
} from "@/api/Veri/EDefterInceleme";
import ExceleAktarButton from "@/app/(Uygulama)/components/Veri/ExceleAktarButton";
import { usePathname, useRouter } from "next/navigation";
import numbro from "numbro";
import trTR from "numbro/languages/tr-TR";
import { getOrneklemFisleri } from "@/api/DenetimKanitlari/DenetimKanitlari";
import TespitAciklamaForm from "@/app/(Uygulama)/components/DenetimKanitlari/Onemlilik/TespitAciklamaForm";

// register Handsontable's modules
registerAllModules();

numbro.registerLanguage(trTR);
numbro.setLanguage("tr-TR");

interface Veri {
  id: number;
  secim: boolean;
  fisNo: number;
  fisTarihi: string;
  detayKodu: string;
  hesapAdi: string;
  aciklama: string;
  borc: number;
  alacak: number;
  tespitAciklama: string;
}

const OrneklemFisleri = () => {
  const hotTableComponent = useRef<any>(null);

  const pathname = usePathname();
  const segments = pathname.split("/");
  const idIndex = segments.indexOf("OrneklemFisleri") + 1;
  const pathKebirKodu = parseInt(segments[idIndex]);

  const user = useSelector((state: AppState) => state.userReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();

  const [rowCount, setRowCount] = useState(0);

  const [fetchedData, setFetchedData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const [tespitAciklama, setTespitAciklama] = useState("");

  const [
    secilenlereTespitAciklamaKaydetTiklandimi,
    setSecilenlereTespitAciklamaKaydetTiklandimi,
  ] = useState(false);

  useEffect(() => {
    const loadStyles = async () => {
      dispatch(setCollapse(true));
      if (customizer.activeMode === "dark") {
        await import(
          "@/app/(Uygulama)/components/Veri/HandsOnTable/HandsOnTableDark.css"
        );
      } else {
        await import(
          "@/app/(Uygulama)/components/Veri/HandsOnTable/HandsOnTableLight.css"
        );
      }
    };

    loadStyles();
  }, [customizer.activeMode]);

  const colHeaders = [
    "Id",
    "Seçim",
    "Yevmiye No",
    "Yevmiye Tarihi",
    "Detay Kodu",
    "Hesap Adı",
    "Açıklama",
    "Borç",
    "Alacak",
    "Tespit Açıklama",
  ];

  const columns = [
    {
      type: "numeric",
      columnSorting: true,
      readOnly: true,
      editor: false,
      className: "htLeft",
    }, // Id
    {
      type: "checkbox",
      className: "htCenter",
    }, // Seçim
    {
      type: "numeric",
      columnSorting: true,
      readOnly: true,
      editor: false,
      className: "htLeft",
    }, // Yevmiye No
    {
      type: "text",
      columnSorting: true,
      readOnly: true,
      editor: false,
      className: "htRight",
    }, // Yevmiye Tarihi
    {
      type: "text",
      columnSorting: true,
      readOnly: true,
      editor: false,
      className: "htLeft",
    }, // Detay Kodu
    {
      type: "text",
      columnSorting: true,
      readOnly: true,
      editor: false,
      className: "htLeft",
    }, // Hesap Adı
    {
      type: "text",
      columnSorting: true,
      readOnly: true,
      editor: false,
      className: "htLeft",
    }, // Açıklama
    {
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        columnSorting: true,
        culture: "tr-TR",
      },
      columnSorting: true,
      readOnly: true,
      editor: false,
      className: "htRight",
    }, // Borc
    {
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        columnSorting: true,
        culture: "tr-TR",
      },
      columnSorting: true,
      readOnly: true,
      editor: false,
      className: "htRight",
    }, // Alacak
    {
      type: "text",
      columnSorting: true,
      className: "htLeft",
    }, // Tespit Açıklama
  ];

  const afterGetColHeader = (col: any, TH: any) => {
    TH.style.height = "50px";

    let div = TH.querySelector("div");
    if (!div) {
      div = document.createElement("div");
      TH.appendChild(div);
    }

    div.style.whiteSpace = "normal";
    div.style.wordWrap = "break-word";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.height = "100%";
    div.style.position = "relative";

    //typography body1
    TH.style.fontFamily = plus.style.fontFamily;
    TH.style.fontWeight = 500;
    TH.style.fontSize = "0.875rem";
    TH.style.lineHeight = "1.334rem";

    //color
    TH.style.color = customizer.activeMode === "dark" ? "#ffffff" : "#2A3547";
    TH.style.backgroundColor = theme.palette.primary.light;
    //customizer.activeMode === "dark" ? "#253662" : "#ECF2FF";

    TH.style.borderColor = customizer.activeMode === "dark" ? "#10141c" : "#";

    if (col != 1) {
      // Create span for the header text
      let span = div.querySelector("span");
      if (!span) {
        span = document.createElement("span");
        div.appendChild(span);
      }
      span.textContent = colHeaders[col];
      span.style.position = "absolute";
      span.style.marginRight = "16px";
      span.style.left = "4px";

      // Create button if it does not exist
      let button = div.querySelector("button");
      if (!button) {
        button = document.createElement("button");
        button.style.display = "none";
        div.appendChild(button);
      }
      button.style.position = "absolute";
      button.style.right = "4px";
    } else {
      div.style.justifyContent = "space-between";

      // Destroy the button if it exists
      let button = div.querySelector("button");
      if (button) {
        div.removeChild(button); // Remove the button from the DOM
      }

      // Create checkbox if it does not exist
      let checkbox = div.querySelector("input[type='checkbox']");
      if (!checkbox) {
        checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        div.appendChild(checkbox);
      }

      checkbox.onclick = function () {
        if (checkbox.checked) {
          fetchedData.map((item) => {
            item[1] = true;
          });
          const updatedSelectedRows = fetchedData.filter(
            (row) => row[1] == true
          );

          setSelectedRows(updatedSelectedRows);
        } else {
          fetchedData.map((item) => {
            item[1] = false;
          });
          setSelectedRows([]);
        }

        const hotTableInstance = hotTableComponent.current.hotInstance;
        hotTableInstance.render();
      };
    }
  };

  const afterGetRowHeader = (row: any, TH: any) => {
    let div = TH.querySelector("div");
    div.style.whiteSpace = "normal";
    div.style.wordWrap = "break-word";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.style.height = "100%";

    //typography body1
    TH.style.fontFamily = plus.style.fontFamily;
    TH.style.fontWeight = 500;
    TH.style.fontSize = "0.875rem";
    TH.style.lineHeight = "1.334rem";

    //color
    TH.style.color = customizer.activeMode === "dark" ? "#ffffff" : "#2A3547";
    TH.style.backgroundColor = theme.palette.primary.light;
    //customizer.activeMode === "dark" ? "#253662" : "#ECF2FF";

    TH.style.borderColor = customizer.activeMode === "dark" ? "#10141c" : "#";
  };

  const afterRenderer = (
    TD: any,
    row: any,
    col: any,
    prop: any,
    value: any,
    cellProperties: any
  ) => {
    //typography body1
    TD.style.fontFamily = plus.style.fontFamily;
    TD.style.fontWeight = 500;
    TD.style.fontSize = "0.875rem";
    TD.style.lineHeight = "1.334rem";
    TD.style.whiteSpace = "nowrap";
    TD.style.overflow = "hidden";
    //TD.style.textAlign = "left";

    //color
    TD.style.color = customizer.activeMode === "dark" ? "#ffffff" : "#2A3547";

    if (row % 2 === 0) {
      TD.style.backgroundColor =
        customizer.activeMode === "dark" ? "#171c23" : "#ffffff";
      TD.style.borderColor =
        customizer.activeMode === "dark" ? "#10141c" : "#cccccc";
    } else {
      TD.style.backgroundColor =
        customizer.activeMode === "dark" ? "#10141c" : "#cccccc";
      TD.style.borderColor =
        customizer.activeMode === "dark" ? "#10141c" : "#cccccc";
      TD.style.borderRightColor =
        customizer.activeMode === "dark" ? "#171c23" : "#ffffff";
    }
  };

  const handleGetRowData = async (row: number) => {
    if (hotTableComponent.current) {
      const hotInstance = hotTableComponent.current.hotInstance;
      const cellMeta = hotInstance.getDataAtRow(row);
      console.log("Satır Verileri:", cellMeta);
      return cellMeta;
    }
  };

  const handleAfterChange = async (changes: any, source: any) => {
    //Değişen Cellin Satır Indexi
    let changedRow = -1;

    if (source === "loadData") {
      return; // Skip this hook on loadData
    }
    if (source === "edit" || source === "Autofill.fill") {
      const updatedSelectedRows = fetchedData.filter((row) => row[1] == true);
      setSelectedRows(updatedSelectedRows);
    }
    if (changes) {
      for (const [row, prop, oldValue, newValue] of changes) {
        console.log(
          `Changed cell at row: ${row}, col: ${prop}, from: ${oldValue}, to: ${newValue}`
        );
        changedRow = row;

        //Cell Güncelleme
        if (prop == 9) {
          await handleUpdateEDefterIncelemeVerisi(changedRow);

          changedRow = -1;
        }
      }
    }
  };

  const handleUpdateEDefterIncelemeVerisi = async (row: number) => {
    const rowData = await handleGetRowData(row);
    if (rowData[9] == null || rowData[9] == undefined) {
      rowData[9] == "";
    }
    const updatedEDefterIncelemeVerisi = {
      tespitAciklama: rowData[9],
    };

    try {
      const result = await updateEDefterIncelemeVerisi(
        user.token || "",
        user.denetciId || 0,
        user.denetlenenId || 0,
        user.yil || 0,
        rowData[0],
        updatedEDefterIncelemeVerisi
      );
      if (result) {
        await fetchData();
        console.log("E-Defter İnceleme Verisi güncelleme başarılı");
      } else {
        console.error("E-Defter İnceleme güncelleme başarısız");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const handleUpdateEDefterIncelemeListeVerisi = async () => {
    const updatedEDefterIncelemeVerisi = {
      tespitAciklama: tespitAciklama,
    };

    const ids: string[] = selectedRows
      .filter((row: any[]) => row[1] === true)
      .map((row: any[]) => row[0]);

    try {
      const result = await updateEDefterIncelemeListeVerisi(
        user.token || "",
        user.denetciId || 0,
        user.denetlenenId || 0,
        user.yil || 0,
        ids,
        updatedEDefterIncelemeVerisi
      );
      if (result) {
        setSecilenlereTespitAciklamaKaydetTiklandimi(false);
        console.log("E-Defter İnceleme Verisi güncelleme başarılı");
      } else {
        setSecilenlereTespitAciklamaKaydetTiklandimi(false);
        console.error("E-Defter İnceleme güncelleme başarısız");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const fetchData = async () => {
    try {
      const orneklemFisleriVerileri = await getOrneklemFisleri(
        user.token || "",
        user.denetciId || 0,
        user.denetlenenId || 0,
        user.yil || 0,
        pathKebirKodu
      );
      const rowsAll: any = [];

      orneklemFisleriVerileri.forEach((veri: any) => {
        const newRow: any = [
          veri.id,
          false,
          veri.yevmiyeNo,
          veri.yevmiyeTarih.split("T")[0].split("-").reverse().join("."),
          veri.detayKodu,
          veri.hesapAdi,
          veri.aciklama,
          veri.borc,
          veri.alacak,
          veri.tespitAciklama,
        ];
        rowsAll.push(newRow);
      });

      setFetchedData(rowsAll);
      setRowCount(rowsAll.length);
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (secilenlereTespitAciklamaKaydetTiklandimi) {
      handleUpdateEDefterIncelemeListeVerisi();
    } else {
      fetchData();
    }
  }, [secilenlereTespitAciklamaKaydetTiklandimi]);

  const handleDownload = () => {
    const hotTableInstance = hotTableComponent.current.hotInstance;
    const data = hotTableInstance.getData();

    const processedData = data.map((row: any) => row.slice(2));

    const headers = hotTableInstance.getColHeader().slice(2);

    const fullData = [headers, ...processedData];

    async function createExcelFile() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sayfa1");

      fullData.forEach((row: any) => {
        worksheet.addRow(row);
      });

      const headerRow = worksheet.getRow(1);
      headerRow.font = {
        name: "Calibri",
        size: 12,
        bold: true,
        color: { argb: "FFFFFF" },
      };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1a6786" },
      };
      headerRow.alignment = { horizontal: "left" };

      worksheet.columns.forEach((column) => {
        column.width = 25;
      });

      try {
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "OrneklemFisleri.xlsx");
        console.log("Excel dosyası başarıyla oluşturuldu");
      } catch (error) {
        console.error("Excel dosyası oluşturulurken bir hata oluştu:", error);
      }
    }
    createExcelFile();
  };

  useEffect(() => {
    if (hotTableComponent.current) {
      const diff = customizer.isCollapse
        ? 0
        : customizer.SidebarWidth && customizer.MiniSidebarWidth
        ? customizer.SidebarWidth - customizer.MiniSidebarWidth
        : 0;

      hotTableComponent.current.hotInstance.updateSettings({
        width: customizer.isCollapse
          ? "100%"
          : hotTableComponent.current.hotInstance.rootElement.clientWidth -
            diff,
      });
    }
  }, [customizer.isCollapse]);

  return (
    <>
      <Grid container mb={2}>
        <Grid item xs={12} lg={12}>
          <TespitAciklamaForm
            tespitAciklama={tespitAciklama}
            setTespitAciklama={setTespitAciklama}
            setSecilenlereTespitAciklamaKaydetTiklandimi={
              setSecilenlereTespitAciklamaKaydetTiklandimi
            }
          />
        </Grid>
      </Grid>
      <HotTable
        style={{
          height: "100%",
          width: "100%",
          maxHeight: 684,
          maxWidth: "100%",
        }}
        language={dictionary.languageCode}
        ref={hotTableComponent}
        data={fetchedData}
        height={684}
        colHeaders={colHeaders}
        columns={columns}
        colWidths={[0, 40, 50, 50, 80, 150, 180, 100, 100, 180]}
        stretchH="all"
        manualColumnResize={true}
        rowHeaders={true}
        rowHeights={35}
        autoWrapRow={true}
        minRows={rowCount}
        minCols={9}
        hiddenColumns={{
          columns: [0],
        }}
        filters={true}
        columnSorting={true}
        dropdownMenu={[
          "filter_by_condition",
          "filter_by_value",
          "filter_action_bar",
        ]}
        licenseKey="non-commercial-and-evaluation" // For non-commercial use only
        afterGetColHeader={afterGetColHeader}
        afterGetRowHeader={afterGetRowHeader}
        afterRenderer={afterRenderer}
        afterChange={handleAfterChange}
        copyPaste={false}
        contextMenu={{
          items: {
            gise_git: {
              name: "Fişe Git",
              callback: async function (key, selection) {
                const row = await handleGetRowData(selection[0].start.row);
                router.push(
                  `/DenetimKanitlari/Onemlilik/Orneklem/OrneklemFisleri/${row[4].substring(
                    0,
                    3
                  )}/FisDetaylari/${row[2]}`
                );
              },
            },
          },
        }}
      />
      {fetchedData.length > 0 && (
        <Grid container marginTop={2}>
          <Grid item xs={12} lg={10}></Grid>
          <Grid
            item
            xs={12}
            lg={2}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <ExceleAktarButton
              handleDownload={handleDownload}
            ></ExceleAktarButton>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default OrneklemFisleri;
