import {
  createBaglantiBilgileri,
  deleteBaglantiBilgileriById,
  getBaglantiBilgileriByTip,
} from "@/api/BaglantiBilgileri/BaglantiBilgileri";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { enqueueSnackbar } from "notistack";

interface Veri {
  id: number;
  link: string;
  baslangicTarihi: string;
  bitisTarihi: string;
  tip: string;
}

interface VeriPaylasimBaglantisiPopUpProps {
  setControl: (b: boolean) => void;
  isPopUpOpen: boolean;
  handleClosePopUp: () => void;
}

const VeriPaylasimBaglantisiPopUp: React.FC<
  VeriPaylasimBaglantisiPopUpProps
> = ({ setControl, isPopUpOpen, handleClosePopUp }) => {
  const user = useSelector((state: AppState) => state.userReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  const [fetchedData, setFetchedData] = useState<Veri | null>(null);

  const [copied, setCopied] = useState(false);

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleCreateBaglantiBilgileri = async () => {
    try {
      const result = await createBaglantiBilgileri(
        user.token || "",
        user.denetciId || 0,
        user.denetlenenId || 0,
        user.id || 0,
        user.yil || 0,
        "DefterKVBeyannamesi"
      );
      if (result) {
        await fetchData();
        enqueueSnackbar("Bağlantı Oluşturuldu", {
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
        enqueueSnackbar("Bağlantı Oluşturulamadı", {
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

  const handleDeleteBaglantiBilgileri = async () => {
    try {
      const result = await deleteBaglantiBilgileriById(
        user.token || "",
        user.denetciId || 0,
        user.denetlenenId || 0,
        user.id || 0,
        user.yil || 0,
        fetchedData ? fetchedData.id : 0
      );
      if (result) {
        await fetchData();
        enqueueSnackbar("Bağlantı Kaldırıldı", {
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
        enqueueSnackbar("Bağlantı Kaldırılamadı", {
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
    try {
      // Tarihleri "DD.MM.YYYY HH:mm" formatında ayarla
      const formatDateTime = (dateTimeStr?: string) => {
        if (!dateTimeStr) return "";
        const date = new Date(dateTimeStr);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${pad(date.getDate())}.${pad(
          date.getMonth() + 1
        )}.${date.getFullYear()} ${pad(date.getHours())}:${pad(
          date.getMinutes()
        )}`;
      };

      const baglantiBilgisi = await getBaglantiBilgileriByTip(
        user.token || "",
        user.denetciId || 0,
        user.denetlenenId || 0,
        user.id || 0,
        user.yil || 0,
        "DefterKVBeyannamesi"
      );
      if (baglantiBilgisi != undefined) {
        const newRow: Veri = {
          id: baglantiBilgisi.id,
          link: baglantiBilgisi.link,
          baslangicTarihi: formatDateTime(baglantiBilgisi.baslangicTarihi),
          bitisTarihi: formatDateTime(baglantiBilgisi.bitisTarihi),
          tip: baglantiBilgisi.tip,
        };

        setFetchedData(newRow);
      } else {
        setFetchedData(null);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth={"md"}
      open={isPopUpOpen}
      onClose={handleClosePopUp}
    >
      <>
        <DialogContent className="testdialog" sx={{ overflow: "visible" }}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Typography variant="h4" py={1} px={3}>
              Paylaşım Bağlantısı
            </Typography>
            <IconButton size="small" onClick={handleClosePopUp}>
              <IconX size="18" />
            </IconButton>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogContent>
          {fetchedData == null ? (
            <>
              <Box px={3}>
                <Typography variant="body1" p={1}>
                  Bağlantı oluşturarak, denetlediğiniz şirkete gerekli alanları
                  doldurması için bir form gönderebilirsiniz.
                </Typography>
                <Typography variant="body1" p={1}>
                  Bağlantı oluşturulduğunda sistem üzerinden veri girişi
                  yapmanız durdurulacaktır.
                </Typography>
              </Box>
              <Box px={3} pt={3}>
                <Button
                  type="button"
                  size="medium"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setControl(true);
                    handleCreateBaglantiBilgileri();
                  }}
                >
                  Paylaşım Bağlantısı Oluştur
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box px={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} lg={4}>
                    <Typography variant="body1" p={1}>
                      Bağlantı:
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    lg={8}
                    display="flex"
                    alignItems="center"
                  >
                    <Typography
                      variant="body1"
                      p={1}
                      sx={{ wordBreak: "break-all", flex: 1 }}
                    >
                      {fetchedData.link}
                    </Typography>
                    <Tooltip title={copied ? "Kopyalandı" : "Kopyala"}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          handleCopy(fetchedData.link);
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={4} lg={4}>
                    <Typography variant="body1" p={1}>
                      Bağlantı Oluşturulma Zamanı:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8} lg={8}>
                    <Typography variant="body1" p={1}>
                      {fetchedData.baslangicTarihi}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4} lg={4}>
                    <Typography variant="body1" p={1}>
                      Bağlantı Erişimi Bitiş Zamanı:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8} lg={8}>
                    <Typography variant="body1" p={1}>
                      {fetchedData.bitisTarihi}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <Typography variant="body1" p={1}>
                      Sistem üzerinden veri girişi yapmanız için bağlantıyı
                      kaldırmalısınız.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box px={3} py={3}>
                <Button
                  type="button"
                  size="medium"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setControl(true);
                    handleDeleteBaglantiBilgileri();
                  }}
                  fullWidth
                >
                  Paylaşım Bağlantısını Kaldır
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </>
    </Dialog>
  );
};

export default VeriPaylasimBaglantisiPopUp;
