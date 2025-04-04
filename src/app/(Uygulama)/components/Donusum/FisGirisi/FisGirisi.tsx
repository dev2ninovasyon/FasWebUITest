import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { dictionary } from "@/utils/languages/handsontable.tr-TR";
import "handsontable/dist/handsontable.full.min.css";
import { plus } from "@/utils/theme/Typography";
import { useDispatch, useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { setCollapse } from "@/store/customizer/CustomizerSlice";
import { createFisGirisiVerisi, getFisNo } from "@/api/Donusum/FisGirisi";
import { IconDeviceFloppy, IconFileTypeXls } from "@tabler/icons-react";

// register Handsontable's modules
registerAllModules();

interface Props {
  kod: string;
  ad: string;
  bakiye: number[];
  fisType: string;
  hazirFislerTiklandimi: boolean;
  handleFilterChange: (str: string) => void;
  setHazirFislerTiklandimi: (bool: boolean) => void;
}

interface Veri {
  yevmiyeNo: number;
  detayKodu: string;
  hesapAdi: string;
  borc: number;
  alacak: number;
  aciklama: string;
}

const FisGirisi: React.FC<Props> = ({
  kod,
  ad,
  bakiye,
  fisType,
  hazirFislerTiklandimi,
  handleFilterChange,
  setHazirFislerTiklandimi,
}) => {
  const hotTableComponent = useRef<any>(null);

  const user = useSelector((state: AppState) => state.userReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();
  const theme = useTheme();

  const smDown = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const [rowCount, setRowCount] = useState<number>(1);

  const [fetchedData, setFetchedData] = useState<any[]>([]);

  const [duplicatesControl, setDuplicatesControl] = useState(false);

  const [startRow, setStartRow] = useState(-1);
  const [endRow, setEndRow] = useState(-1);
  const [startCol, setStartCol] = useState(-1);
  const [endCol, setEndCol] = useState(-1);

  const [lastFisNo, setLastFisNo] = useState(1);

  const [toplamBorc, setToplamBorc] = useState(0);
  const [toplamAlacak, setToplamAlacak] = useState(0);
  const [fark, setFark] = useState(0);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

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
    setTimeout(() => {
      if (numberRegex.test(value)) {
        callback(true);
      } else {
        enqueueSnackbar("Hatalı Sayı Girişi. Ondalıklı Sayı Girmelisiniz.", {
          variant: "warning",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.warning.dark
                : theme.palette.warning.main,
            maxWidth: "720px",
          },
        });
        callback(false);
      }
    }, 1000);
  };

  const integerValidator = (
    value: string,
    callback: (value: boolean) => void
  ) => {
    const integerRegex = /^\d+$/; // Regex to match integers only
    setTimeout(() => {
      if (integerRegex.test(value)) {
        callback(true);
      } else {
        enqueueSnackbar("Hatalı Sayı Girişi. Tam Sayı Girmelisiniz.", {
          variant: "warning",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.warning.dark
                : theme.palette.warning.main,
            maxWidth: "720px",
          },
        });
        callback(false);
      }
    }, 1000);
  };

  function findDuplicateRows(data: any): Veri[] {
    const rowsAsString = new Set<string>();
    const duplicateRows: Veri[] = [];

    const keys = Object.keys(data);

    const [firstKey, ...restKeys] = keys;

    for (const row of data) {
      const { [firstKey]: _, ...rowWithoutSiraNo } = row;

      const rowString = JSON.stringify(
        rowWithoutSiraNo,
        Object.keys(rowWithoutSiraNo).sort()
      );

      if (!rowString.includes("null") && !rowString.includes("{}")) {
        if (rowsAsString.has(rowString)) {
          duplicateRows.push(row);
        } else {
          rowsAsString.add(rowString);
        }
      }
    }
    return duplicateRows;
  }

  useEffect(() => {
    if (duplicatesControl) {
      const duplicatesList = findDuplicateRows(fetchedData);

      let duplicatesMessage = "";
      if (duplicatesList != undefined && duplicatesList != null) {
        duplicatesList.forEach((item: any) => {
          if (item[0] != undefined && item[0] != null) {
            duplicatesMessage = duplicatesMessage + " " + item[0] + ". ";
          }
        });
        if (duplicatesMessage != "") {
          if (duplicatesList.length > 1) {
            enqueueSnackbar(
              duplicatesMessage +
                "Satırlar Tekrar Eden Veri İçeriyor. Kontol Edin.",
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
          } else {
            enqueueSnackbar(
              duplicatesMessage +
                "Satır Tekrar Eden Veri İçeriyor. Kontol Edin.",
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
      }
      setDuplicatesControl(false);
    }
  }, [duplicatesControl]);

  const colHeaders = [
    "Fiş No",
    "Detay Kodu",
    "Hesap Adı",
    "Borç",
    "Alacak",
    "Açıklama",
  ];

  const columns = [
    {
      type: "numeric",
      columnSorting: true,
      className: "htLeft",
      validator: integerValidator,
      allowInvalid: false,
    }, // Fiş No
    { type: "text", columnSorting: true, className: "htLeft" }, // Hesap Kodu / Adı
    { type: "text", columnSorting: true, className: "htLeft" }, // Hesap Adı
    {
      type: "numeric",
      numericFormat: { pattern: "0,0.00", columnSorting: true },
      className: "htRight",
      validator: numberValidator,
      allowInvalid: false,
    }, // Borç
    {
      type: "numeric",
      numericFormat: { pattern: "0,0.00", columnSorting: true },
      className: "htRight",
      validator: numberValidator,
      allowInvalid: false,
    }, // Alacak
    { type: "text", columnSorting: true, className: "htLeft" }, // Açıklama
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

    if (
      row >= startRow &&
      row <= endRow &&
      col >= startCol &&
      col <= endCol &&
      value == null
    ) {
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
      setStartRow(-1);
      setEndRow(-1);
      setStartCol(-1);
      setEndCol(-1);

      console.log(
        `Yeni satır(lar) eklendi: ${amount} adet satır ${index} indexinden itibaren.`
      );

      const hotInstance = hotTableComponent.current.hotInstance;
      hotInstance.setDataAtCell(index, 0, lastFisNo); // index satır, 0 sütun, 5 değer
    }
  };

  const handleAfterRemoveRow = async (
    index: number,
    amount: number,
    physicalRows: number[],
    source: any
  ) => {
    setStartRow(0);
    setEndRow(0);
    setStartCol(0);
    setEndCol(0);
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
    setStartRow(coords[0].startRow);
    setEndRow(coords[0].endRow);
    setStartCol(coords[0].startCol);
    setEndCol(coords[0].endCol);
  };

  const handleAfterChange = (changes: any, source: any) => {
    if (source === "loadData") {
      return; // Skip this hook on loadData
    }
    if (changes) {
      for (const [row, prop, oldValue, newValue] of changes) {
        console.log(
          `Changed cell at row: ${row}, col: ${prop}, from: ${oldValue}, to: ${newValue}`
        );
        if (prop === 3) {
          setToplamBorc((prevToplamBorc) => {
            const newNumber =
              parseFloat(
                (newValue ? String(newValue) : "0").replace(",", "")
              ) || 0;
            const oldNumber =
              parseFloat(
                (oldValue ? String(oldValue) : "0").replace(",", "")
              ) || 0;
            return prevToplamBorc + (newNumber - oldNumber);
          });
        }

        if (prop === 4) {
          setToplamAlacak((prevToplamAlacak) => {
            const newNumber =
              parseFloat(
                (newValue ? String(newValue) : "0").replace(",", "")
              ) || 0;
            const oldNumber =
              parseFloat(
                (oldValue ? String(oldValue) : "0").replace(",", "")
              ) || 0;
            return prevToplamAlacak + (newNumber - oldNumber);
          });
        }
      }
    }
  };

  useEffect(() => {
    setFark(toplamBorc - toplamAlacak);
  }, [toplamBorc, toplamAlacak]);

  const handleAfterBeginEditing = (row: number, col: number) => {
    if (col === 1) {
      const hotInstance = hotTableComponent.current.hotInstance;
      const editor = hotInstance.getActiveEditor();
      if (editor) {
        const input = editor.TEXTAREA;
        if (input) {
          const handleInputEvent = (event: KeyboardEvent) => {
            let newValue = (event.target as HTMLInputElement).value;
            handleFilterChange(newValue);

            setTimeout(() => {
              hotInstance.setDataAtCell(row, col, newValue);
            }, 1000);
          };

          const handleEditorBlur = () => {
            input.removeEventListener("input", handleInputEvent);
            input.removeEventListener("blur", handleEditorBlur);
          };

          input.addEventListener("input", handleInputEvent);
          input.addEventListener("blur", handleEditorBlur);
        }
      }
    }
  };

  const handleCreateFisGirisiVerisi = async () => {
    let controlBorcAlacak = true;
    let controlAnaHesap = true;
    let controlHesaplar = true;
    let controlDetayKoduHesapAdi = true;
    let controlBakiye = true;

    const keys = [
      "denetciId",
      "denetlenenId",
      "yil",
      "fisTipi",
      "yevmiyeNo",
      "detayKodu",
      "hesapAdi",
      "borc",
      "alacak",
      "aciklama",
      "tarih",
    ];

    const jsonData = fetchedData.map((item: any[]) => {
      let obj: { [key: string]: any } = {};
      keys.forEach((key, index) => {
        if (
          (item[1] == undefined || item[1] == null || item[1] == "") &&
          (item[2] == undefined || item[2] == null || item[2] == "")
        ) {
          controlDetayKoduHesapAdi = false;
          if (item[1] == "") {
            if (
              item[1].startsWith("590") ||
              item[1].startsWith("591") ||
              item[1].startsWith("690") ||
              item[1].startsWith("692")
            ) {
              controlHesaplar = false;
            }
            if (item[1].length == 3) {
              controlAnaHesap = false;
            }
          }
        }
        if (item[3] === 0 && item[4] === 0) {
          controlBorcAlacak = false;
        } else {
          if (
            (item[3] === undefined || item[3] === null) &&
            (item[4] === undefined || item[4] === null)
          ) {
            controlBorcAlacak = false;
          } else {
            if (item[3] === undefined || item[3] === null) {
              controlBorcAlacak = true;
            } else if (item[4] === undefined || item[4] === null) {
              controlBorcAlacak = true;
            } else {
              if (item[3] > 0 && item[4] > 0) {
                controlBorcAlacak = false;
              } else {
                controlBorcAlacak = true;
              }
            }
          }
        }
        console.log(bakiye[index]);
        if (bakiye[index] < item[3] || bakiye[index] < item[4]) {
          controlBakiye = false;
        }

        if (key === "denetciId") {
          obj[key] = user.denetciId;
        } else if (key === "denetlenenId") {
          obj[key] = user.denetlenenId;
        } else if (key === "yil") {
          obj[key] = user.yil;
        } else if (key === "fisTipi") {
          obj[key] = fisType;
        } else if (key === "tarih") {
          obj[key] = "";
        } else if (key === "borc" || key === "alacak") {
          if (
            (key === "borc" || key === "alacak") &&
            (item[index - 4] == null || item[index - 4] == undefined)
          ) {
            obj[key] = 0.0;
          } else if (typeof item[index - 4] === "string") {
            obj[key] = parseFloat(item[index - 4].replace(",", "."));
          } else {
            obj[key] = item[index - 4];
          }
        } else {
          if (
            key === "aciklama" &&
            (item[index - 4] == null || item[index - 4] == undefined)
          ) {
            obj[key] = "";
          } else {
            obj[key] = item[index - 4];
          }
        }
      });
      return obj;
    });
    let control =
      controlBorcAlacak &&
      controlAnaHesap &&
      controlHesaplar &&
      controlDetayKoduHesapAdi &&
      controlBakiye;
    if (control) {
      try {
        const result = await createFisGirisiVerisi(user.token || "", jsonData);
        if (result) {
          await fetchFisNo();
          setFetchedData([]);
          setStartRow(-1);
          setEndRow(-1);
          setStartCol(-1);
          setEndCol(-1);

          enqueueSnackbar("Fiş Kaydedildi", {
            variant: "success",
            autoHideDuration: 5000,
            style: {
              backgroundColor:
                customizer.activeMode === "dark"
                  ? theme.palette.success.light
                  : theme.palette.success.main,
            },
          });
        } else {
          enqueueSnackbar("Fiş Kaydedilemedi", {
            variant: "error",
            autoHideDuration: 5000,
            style: {
              backgroundColor:
                customizer.activeMode === "dark"
                  ? theme.palette.error.light
                  : theme.palette.error.main,
            },
          });
        }
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    } else {
      if (!controlDetayKoduHesapAdi) {
        enqueueSnackbar("Detay Kodu Ve Hesap Adı Boş Bırakılamaz", {
          variant: "warning",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.warning.dark
                : theme.palette.warning.main,
          },
        });
      } else if (!controlBorcAlacak) {
        enqueueSnackbar("Borç Ya Da Alacak Tutarı Girmelisiniz", {
          variant: "warning",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.warning.dark
                : theme.palette.warning.main,
          },
        });
      } else if (!controlBakiye) {
        enqueueSnackbar("Borç Ya Da Alacak Tutarı Bakiyeden Büyük Olamaz", {
          variant: "warning",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.warning.dark
                : theme.palette.warning.main,
          },
        });
      } else if (!controlAnaHesap) {
        enqueueSnackbar("Ana Hesaba Fiş Girişi Gerçekleştiremezsiniz", {
          variant: "warning",
          autoHideDuration: 5000,
          style: {
            backgroundColor:
              customizer.activeMode === "dark"
                ? theme.palette.warning.dark
                : theme.palette.warning.main,
          },
        });
      } else if (!controlHesaplar) {
        enqueueSnackbar(
          "Dönem Kârı İle İlgili Hesaba Fiş Girişi Gerçekleştiremezsiniz",
          {
            variant: "warning",
            autoHideDuration: 5000,
            style: {
              backgroundColor:
                customizer.activeMode === "dark"
                  ? theme.palette.warning.dark
                  : theme.palette.warning.main,
            },
          }
        );
      }
    }
  };

  const fetchFisNo = async () => {
    try {
      const fisNo = await getFisNo(
        user.token || "",
        user.denetciId || 0,
        user.denetlenenId || 0,
        user.yil || 0
      );
      setLastFisNo(fisNo + 1);
      const hotInstance = hotTableComponent.current.hotInstance;
      hotInstance.setDataAtCell(0, 0, fisNo + 1); // index satır, 0 sütun, 5 değer
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchFisNo();
  }, []);

  useEffect(() => {
    if (hazirFislerTiklandimi) {
      fetchFisNo();
      setHazirFislerTiklandimi(false);
    }
  }, [hazirFislerTiklandimi]);

  useEffect(() => {
    if (hotTableComponent.current) {
      const row = hotTableComponent.current.hotInstance.countRows() - 1;
      if (kod != "" && ad != "") {
        const hotInstance = hotTableComponent.current.hotInstance;
        hotInstance.setDataAtCell(row, 1, kod);
        hotInstance.setDataAtCell(row, 2, ad);
      }
    }
  }, [kod, ad]);

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
    <Grid container>
      <Grid item xs={12} lg={12}>
        <HotTable
          style={{
            width: "100%",
            minHeight: "100px",
            maxHeight: 684,
            maxWidth: "100%",
            overflow: smDown ? "auto" : "",
          }}
          language={dictionary.languageCode}
          ref={hotTableComponent}
          data={fetchedData}
          colHeaders={colHeaders}
          columns={columns}
          colWidths={[32, 100, 150, 100, 100, 100]}
          stretchH="all"
          manualColumnResize={true}
          rowHeaders={true}
          rowHeights={35}
          autoWrapRow={true}
          minRows={rowCount}
          minCols={6}
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
          afterPaste={afterPaste} // Add afterPaste hook
          afterCreateRow={handleCreateRow} // Add createRow hook
          afterRemoveRow={handleAfterRemoveRow} // Add afterRemoveRow hook
          afterChange={handleAfterChange} // Add afterChange hook
          afterBeginEditing={handleAfterBeginEditing}
          contextMenu={{
            items: {
              row_above: {},
              row_below: {},
              remove_row: {},
              alignment: {},
              copy: {},

              fis_esitle: {
                name: "Fiş eşitle",
                callback: async function (key, selection) {
                  const hotInstance = hotTableComponent.current.hotInstance;
                  if (fark < 0) {
                    hotInstance.setDataAtCell(
                      selection[0].start.row,
                      3,
                      Math.abs(fark)
                    );
                    hotInstance.setDataAtCell(
                      selection[0].start.row,
                      4,
                      formatNumber(0)
                    );
                  } else if (fark == 0) {
                    hotInstance.setDataAtCell(
                      selection[0].start.row,
                      3,
                      formatNumber(0)
                    );
                    hotInstance.setDataAtCell(
                      selection[0].start.row,
                      4,
                      formatNumber(0)
                    );
                  } else {
                    hotInstance.setDataAtCell(
                      selection[0].start.row,
                      3,
                      formatNumber(0)
                    );
                    hotInstance.setDataAtCell(
                      selection[0].start.row,
                      4,
                      Math.abs(fark)
                    );
                  }
                },
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12} lg={6}></Grid>
      <Grid
        item
        xs={12}
        lg={4}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          gap={2}
          flexWrap="wrap"
          sx={{ flex: 1 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              flex: 1,
              backgroundColor: "primary.light",
              overflow: "auto",
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Toplam
            </Typography>
            <Typography variant="subtitle1" align="right">
              {formatNumber(toplamBorc)}
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              flex: 1,
              backgroundColor: "primary.light",
              overflow: "auto",
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Toplam
            </Typography>
            <Typography variant="subtitle1" align="right">
              {formatNumber(toplamAlacak)}
            </Typography>
          </Paper>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        lg={2}
        display={"flex"}
        alignItems={"center"}
        sx={{ py: 2, pl: { lg: 2 } }}
      >
        <Button
          size="medium"
          variant="outlined"
          color="primary"
          startIcon={<IconDeviceFloppy width={18} />}
          onClick={() => handleCreateFisGirisiVerisi()}
          sx={{ width: "100%" }}
        >
          Kaydet
        </Button>
      </Grid>
    </Grid>
  );
};

export default FisGirisi;
