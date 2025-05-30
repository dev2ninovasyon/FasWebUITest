import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { dictionary } from "@/utils/languages/handsontable.tr-TR";
import "handsontable/dist/handsontable.full.min.css";
import { plus } from "@/utils/theme/Typography";
import { useDispatch, useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { Grid, Paper, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getFormat } from "@/api/Veri/base";
import { enqueueSnackbar } from "notistack";
import ExceleAktarButton from "@/app/(Uygulama)/components/Veri/ExceleAktarButton";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { setCollapse } from "@/store/customizer/CustomizerSlice";
import numbro from "numbro";
import trTR from "numbro/languages/tr-TR";
import {
  createDonusturulmusMizanVerisi,
  deleteDonusturulmusMizanVerisi,
  getDonusturulmusMizanVerileriByDenetciDenetlenenYil,
} from "@/api/Veri/DonusturulmusMizan";

// register Handsontable's modules
registerAllModules();

numbro.registerLanguage(trTR);
numbro.setLanguage("tr-TR");

interface Veri {
  kebirKodu: number;
  detayKodu: string;
  hesapAdi: string;
  borc: number;
  alacak: number;
  fisBorc: number;
  fisAlcak: number;
  raporBorc: number;
  raporAlacak: number;
  borcBakiye: number;
  alacakBakiye: number;
}

interface Props {
  genelHesapPlaniListesi: any;
  kaydetTiklandimi: boolean;
  setKaydetTiklandimi: (b: boolean) => void;
}

const DonusturulmusMizan: React.FC<Props> = ({
  genelHesapPlaniListesi,
  kaydetTiklandimi,
  setKaydetTiklandimi,
}) => {
  const hotTableComponent = useRef<any>(null);

  const user = useSelector((state: AppState) => state.userReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();
  const theme = useTheme();

  const [rowCount, setRowCount] = useState<number>(200);

  const [fetchedData, setFetchedData] = useState<Veri[]>([]);

  const [duplicatesControl, setDuplicatesControl] = useState(false);

  const uyari = [
    "Boş Bırakılmaması Gereken Sütunlar: Kebir Kodu, Detay Hesap Kodu, Hesap Adı, Borç, Alacak, Fiş Borç, Fiş Alacak, Rapor Borç, Rapor Alacak, Borç Bakiye, Alacak Bakiye",
    "Kebir Kodu Sütunu Boş Bırakılmamalıdır Ve Tam Sayı Girilmelidir.",
    "Detay Hesap Kodu Sütunu Boş Bırakılmamalıdır Ve Seçeneklerden Biri Seçilmelidir.",
    "Hesap Adı Sütunu Boş Bırakılmamalıdır.",
    "Borç, Alacak, Fiş Borç, Fiş Alacak, Rapor Borç, Rapor Alacak, Borç Bakiye Ve Alacak Bakiye Sütunları Boş Bırakılmamalıdır Ve Ondalıklı Sayı Girilmelidir.",
  ];

  const [endRow, setEndRow] = useState(-1);

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

  const numberValidator = (
    value: string,
    callback: (value: boolean) => void
  ) => {
    const numberRegex = /^[0-9]+(\.[0-9]+)?$/; // Regex to match numbers with optional decimal part
    if (numberRegex.test(value)) {
      callback(true);
    } else {
      callback(false);
    }
  };

  const negativeNumberValidator = (
    value: string,
    callback: (value: boolean) => void
  ) => {
    const numberRegex = /^-?[0-9]+(\.[0-9]+)?$/; // Regex to match numbers with optional decimal part
    if (numberRegex.test(value)) {
      callback(true);
    } else {
      callback(false);
    }
  };

  const integerValidator = (
    value: string,
    callback: (value: boolean) => void
  ) => {
    const integerRegex = /^\d+$/; // Regex to match integers only
    if (integerRegex.test(value)) {
      callback(true);
    } else {
      callback(false);
    }
  };

  function isRowEmpty(row: Veri): boolean {
    return Object.values(row).every(
      (value) =>
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
    );
  }

  function findDuplicateRows(data: Veri[]): number[] {
    const seenRows = new Set<string>();
    const duplicates: number[] = [];

    data.forEach((row, index) => {
      if (isRowEmpty(row)) return; // tüm değerler boşsa geç

      const rowString = JSON.stringify(row, Object.keys(row).sort());

      if (seenRows.has(rowString)) {
        duplicates.push(index + 1); // 1-based row number
      } else {
        seenRows.add(rowString);
      }
    });

    return duplicates;
  }

  useEffect(() => {
    if (duplicatesControl) {
      const duplicateRowNumbers = findDuplicateRows(fetchedData);

      if (duplicateRowNumbers.length > 0) {
        const duplicatesMessage = duplicateRowNumbers.join(", ") + " ";

        enqueueSnackbar(
          `${duplicatesMessage}Numaralı Satır${
            duplicateRowNumbers.length > 1 ? "lar" : ""
          } Tekrar Eden Veri İçeriyor. Kontrol Edin.`,
          {
            variant: "warning",
            autoHideDuration: 5000,
            style: {
              backgroundColor:
                customizer.activeMode === "dark"
                  ? theme.palette.warning.dark
                  : theme.palette.warning.main,
              maxWidth: "720px",
            },
          }
        );
      }

      setDuplicatesControl(false);
    }
  }, [duplicatesControl]);

  const colHeaders = [
    "Kebir Kodu",
    "D. Hesap Kodu",
    "Hesap Adı",
    "Borç",
    "Alacak",
    "Fiş Borç",
    "Fiş Alacak",
    "Rapor Borç",
    "Rapor Alacak",
    "Borç Bakiye",
    "Alacak Bakiye",
  ];

  const columns = [
    {
      type: "numeric",
      columnSorting: true,
      className: "htLeft",
      validator: integerValidator,
      allowInvalid: false,
    }, // Kebir Kodu
    {
      type: "autocomplete",
      source: function (query: string, process: (result: string[]) => void) {
        let results = genelHesapPlaniListesi
          .filter((item: any) => item.kod.includes(query))
          .slice(0, 50)
          .map((item: any) => item.kod);
        process(results);
      },
      strict: true,
      allowInvalid: false,
      className: "htLeft",
    }, // Detay Hesap Kodu
    {
      type: "text",
      columnSorting: true,
      className: "htLeft",
      allowInvalid: false,
    }, // Hesap Adı
    {
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        columnSorting: true,
        culture: "tr-TR",
      },
      className: "htRight",
      validator: numberValidator,
      allowInvalid: false,
    }, // Borc
    {
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        columnSorting: true,
        culture: "tr-TR",
      },
      className: "htRight",
      validator: numberValidator,
      allowInvalid: false,
    }, // Alacak
    {
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        columnSorting: true,
        culture: "tr-TR",
      },
      className: "htRight",
      validator: numberValidator,
      allowInvalid: false,
    }, // Fiş Borc
    {
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        columnSorting: true,
        culture: "tr-TR",
      },
      className: "htRight",
      validator: numberValidator,
      allowInvalid: false,
    }, // Fiş Alacak
    {
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        columnSorting: true,
        culture: "tr-TR",
      },
      className: "htRight",
      validator: numberValidator,
      allowInvalid: false,
    }, // Rapor Borc
    {
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        columnSorting: true,
        culture: "tr-TR",
      },
      className: "htRight",
      validator: numberValidator,
      allowInvalid: false,
    }, // Rapor Alacak
    {
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        columnSorting: true,
        culture: "tr-TR",
      },
      className: "htRight",
      validator: numberValidator,
      allowInvalid: false,
    }, // Borç Bakiye
    {
      type: "numeric",
      numericFormat: {
        pattern: "0,0.00",
        columnSorting: true,
        culture: "tr-TR",
      },
      className: "htRight",
      validator: negativeNumberValidator,
      allowInvalid: false,
    }, // Alacak Bakiye
  ];

  const afterGetColHeader = (col: any, TH: any) => {
    // Set the height of the column headers
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

    if (row <= endRow && (value == undefined || value == null || value == "")) {
      TD.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
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

  const handleCreateRow = async (index: number, amount: number) => {
    if (amount == 1 && index != rowCount - 1) {
      console.log(
        `Yeni satır(lar) eklendi: ${amount} adet satır ${index} indexinden itibaren.`
      );
    }
  };

  const handleAfterRemoveRow = async (
    index: number,
    amount: number,
    physicalRows: number[],
    source: any
  ) => {
    console.log(
      `Satır(lar) silindi: ${amount} adet satır ${index} indexinden itibaren.${physicalRows}`
    );
  };

  const afterPaste = async (data: any, coords: any) => {
    console.log("Pasted data:", data);

    console.log("Pasted startRow coordinates:", coords[0].startRow);
    console.log("Pasted endRow coordinates:", coords[0].endRow);
    console.log("Pasted startCol coordinates:", coords[0].startCol);
    console.log("Pasted endCol coordinates:", coords[0].endCol);

    if (endRow < coords[0].endRow) {
      setEndRow(coords[0].endRow);
    }
  };

  const handleAfterChange = async (changes: any, source: any) => {
    if (source === "loadData" || !changes) return;

    const hesapMap = new Map<string, { kod: string; adi: string }>(
      genelHesapPlaniListesi.map((item: any) => [item.kod, item])
    );

    const rowsToUpdate = new Map<number, { kod?: string; adi?: string }>();

    for (const [row, prop, oldValue, newValue] of changes) {
      if (prop === 1 && newValue !== oldValue) {
        const matched = hesapMap.get(newValue);
        const currentRowData = rowsToUpdate.get(row) ?? {};

        if (newValue && typeof newValue === "string" && newValue.length >= 3) {
          if (
            newValue.substring(0, 3) !==
            hotTableComponent.current?.hotInstance.getDataAtCell(row, 0)
          ) {
            currentRowData.kod = newValue.substring(0, 3);
          }
        }

        if (
          matched?.adi &&
          matched.adi !==
            hotTableComponent.current?.hotInstance.getDataAtCell(row, 2)
        ) {
          currentRowData.adi = matched.adi;
        }

        rowsToUpdate.set(row, currentRowData);
      }
    }

    // Toplu hücre güncellemeleri (tek render tetikler)
    hotTableComponent.current?.hotInstance.batch(() => {
      rowsToUpdate.forEach((data, row) => {
        if (data.kod !== undefined) {
          hotTableComponent.current?.hotInstance.setDataAtCell(
            row,
            0,
            data.kod
          );
        }
        if (data.adi !== undefined) {
          hotTableComponent.current?.hotInstance.setDataAtCell(
            row,
            2,
            data.adi
          );
        }
      });
    });
  };

  const handleBeforeChange = (changes: any[]) => {
    if (!changes) return;

    for (let i = 0; i < changes.length; i++) {
      const [row, prop, oldValue, newValue] = changes[i];

      if ([3, 4, 5, 6, 7, 8, 9, 10].includes(prop)) {
        if (typeof newValue === "string") {
          const cleanedNewValue = newValue.replaceAll(/\./g, "");
          changes[i][3] = cleanedNewValue;
        }
      }
    }
  };

  const handleCreateDonusturulmusMizanVerisi = async () => {
    if (fetchedData.filter((item: any) => item[0]).length == 0) {
      await handleDeleteDonusturulmusMizanVerisi();
      return;
    }

    const keys = [
      "denetciId",
      "denetlenenId",
      "yil",
      "kebirKodu",
      "detayhesapKodu",
      "hesapAdi",
      "borc",
      "alacak",
      "fisBorc",
      "fisAlacak",
      "raporBorc",
      "raporAlacak",
      "borcBakiye",
      "alacakBakiye",
    ];

    const jsonData = fetchedData
      .filter((item: any) => item[0])
      .map((item: any) => {
        let obj: { [key: string]: any } = {};
        keys.forEach((key, index) => {
          if (key === "denetciId") {
            obj[key] = user.denetciId;
          } else if (key === "denetlenenId") {
            obj[key] = user.denetlenenId;
          } else if (key === "yil") {
            obj[key] = user.yil;
          } else if (
            key === "borc" ||
            key === "alacak" ||
            key === "fisBorc" ||
            key === "fisAlacak" ||
            key === "raporBorc" ||
            key === "raporAlacak" ||
            key === "borcBakiye" ||
            key === "alacakBakiye"
          ) {
            if (
              item[index - 3] == undefined ||
              item[index - 3] == null ||
              item[index - 3] == ""
            ) {
              obj[key] = 0.0;
            } else {
              obj[key] = item[index - 3];
            }
          } else {
            if (
              item[index - 3] == undefined ||
              item[index - 3] == null ||
              item[index - 3] == ""
            ) {
              obj[key] = null;
            } else {
              obj[key] = item[index - 3];
            }
          }
        });

        return obj;
      });

    try {
      const result = await createDonusturulmusMizanVerisi(
        user.token || "",
        jsonData
      );
      if (result) {
        await fetchData();
        enqueueSnackbar("Kaydedildi", {
          variant: "success",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.success.light
                : theme.palette.success.main,
            maxWidth: "720px",
          },
        });
      } else {
        enqueueSnackbar("Kaydedilemedi", {
          variant: "error",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.error.light
                : theme.palette.error.main,
            maxWidth: "720px",
          },
        });
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const handleDeleteDonusturulmusMizanVerisi = async () => {
    try {
      const result = await deleteDonusturulmusMizanVerisi(
        user.token || "",
        user.denetciId || 0,
        user.denetlenenId || 0,
        user.yil || 0
      );
      if (result) {
        await fetchData();
        enqueueSnackbar("Kaydedildi", {
          variant: "success",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.success.light
                : theme.palette.success.main,
            maxWidth: "720px",
          },
        });
      } else {
        enqueueSnackbar("Kaydedilemedi", {
          variant: "error",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.error.light
                : theme.palette.error.main,
            maxWidth: "720px",
          },
        });
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const fetchData = async () => {
    setEndRow(-1);

    try {
      const donusturulmusMizanVerileri =
        await getDonusturulmusMizanVerileriByDenetciDenetlenenYil(
          user.token || "",
          user.denetciId || 0,
          user.denetlenenId || 0,
          user.yil || 0
        );

      const rowsAll: any = [];
      donusturulmusMizanVerileri.forEach((veri: any) => {
        const newRow: any = [
          veri.kebirKodu,
          veri.detayKodu,
          veri.hesapAdi,
          veri.vukBorc,
          veri.vukAlacak,
          veri.fisBorc,
          veri.fisAlacak,
          veri.raporBorc,
          veri.raporAlacak,
          veri.borcBakiye,
          veri.alacakBakiye,
        ];
        rowsAll.push(newRow);
      });

      setFetchedData(rowsAll);
      setDuplicatesControl(true);
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const fetchRowCount = async () => {
    try {
      const format = await getFormat(user.token || "", "Dönüştürülmüş Mizan");
      setRowCount(format.satirSayisi);
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchRowCount();
  }, []);

  useEffect(() => {
    if (kaydetTiklandimi) {
      handleCreateDonusturulmusMizanVerisi();
      setKaydetTiklandimi(false);
    }
  }, [kaydetTiklandimi]);

  const handleDownload = () => {
    const hotTableInstance = hotTableComponent.current.hotInstance;
    const data = hotTableInstance.getData();

    const processedData = data.map((row: any) => row);

    const headers = hotTableInstance.getColHeader();

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
        saveAs(blob, "DonusturulmusMizanFormati.xlsx");
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
      <Grid container>
        <Grid item xs={12} lg={12}>
          <Paper
            elevation={2}
            sx={{
              p: 1,
              mb: 2,
              borderRadius: 1,
              backgroundColor: "warning.light",
            }}
          >
            {uyari.map((mesaj, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{ color: "warning.dark" }}
              >
                - {mesaj}
              </Typography>
            ))}
          </Paper>
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
        colWidths={[70, 80, 110, 100, 100, 100, 100, 100, 100, 100, 100]}
        stretchH="all"
        manualColumnResize={true}
        rowHeaders={true}
        rowHeights={35}
        autoWrapRow={true}
        minRows={rowCount}
        minCols={11}
        filters={true}
        columnSorting={true}
        dropdownMenu={[
          "filter_by_condition",
          "filter_by_value",
          "filter_action_bar",
        ]}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        afterGetColHeader={afterGetColHeader}
        afterGetRowHeader={afterGetRowHeader}
        afterRenderer={afterRenderer}
        afterPaste={afterPaste} // Add afterPaste hook
        afterChange={handleAfterChange} // Add afterChange hook
        beforeChange={handleBeforeChange} // Add beforeChange hook
        afterCreateRow={handleCreateRow} // Add createRow hook
        afterRemoveRow={handleAfterRemoveRow} // Add afterRemoveRow hook
        contextMenu={[
          "row_above",
          "row_below",
          "remove_row",
          "alignment",
          "copy",
        ]}
      />
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
    </>
  );
};

export default DonusturulmusMizan;
