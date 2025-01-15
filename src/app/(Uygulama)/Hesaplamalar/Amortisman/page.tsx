"use client";

import PageContainer from "@/app/(Uygulama)/components/Container/PageContainer";
import Breadcrumb from "@/app/(Uygulama)/components/Layout/Shared/Breadcrumb/Breadcrumb";
import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Grid,
  MenuItem,
  Tab,
  Typography,
  useTheme,
} from "@mui/material";
import { AppState } from "@/store/store";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import {
  createAmortismanHesaplanmis,
  createDavaKarsiliklariHesaplanmis,
  getIskontoOrani,
} from "@/api/Hesaplamalar/Hesaplamalar";
import InfoAlertCart from "@/app/(Uygulama)/components/Alerts/InfoAlertCart";
import CustomFormLabel from "@/app/(Uygulama)/components/Forms/ThemeElements/CustomFormLabel";
import CustomTextField from "@/app/(Uygulama)/components/Forms/ThemeElements/CustomTextField";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AmortismanVeriYukleme from "./AmortismanVeriYukleme";
import CustomSelect from "@/app/(Uygulama)/components/Forms/ThemeElements/CustomSelect";
import AmortismanHesaplama from "./AmortismanHesaplama";

const BCrumb = [
  {
    to: "/Hesaplamalar",
    title: "Hesaplamalar",
  },
  {
    to: "/Hesaplamalar/Amortisman",
    title: "Amortisman",
  },
];

const Page: React.FC = () => {
  const user = useSelector((state: AppState) => state.userReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  const [tip, setTip] = useState("VeriYukleme");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTip(newValue);
  };

  const [hesaplamaYontemi, setHesaplamaYontemi] = useState("Aylık");
  const handleChangeHesaplamaYontemi = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHesaplamaYontemi(event.target.value);
  };

  const [hesaplaTiklandimi, setHesaplaTiklandimi] = useState(false);

  const [openCartAlert, setOpenCartAlert] = useState(false);

  const handleHesapla = async () => {
    try {
      const result = await createAmortismanHesaplanmis(
        user.token || "",
        user.denetciId || 0,
        user.yil || 0,
        user.denetlenenId || 0,
        hesaplamaYontemi
      );
      if (result) {
        setHesaplaTiklandimi(false);
        enqueueSnackbar("Amortisman Hesaplandı", {
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
        enqueueSnackbar("Amortisman Hesaplanamadı", {
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

  useEffect(() => {
    if (hesaplaTiklandimi) {
      setOpenCartAlert(true);
    } else {
      setOpenCartAlert(false);
    }
  }, [hesaplaTiklandimi]);

  return (
    <PageContainer title="Amortisman" description="this is Amortisman">
      <Breadcrumb title="Amortisman" items={BCrumb} />
      <Grid container>
        <Grid item xs={12} lg={12}>
          <TabContext value={tip}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Veri Yükleme" value="VeriYukleme" />
              <Tab label="Hesaplama" value="Hesaplama" />
            </TabList>
            <Divider />
            <TabPanel value="VeriYukleme" sx={{ paddingX: 0 }}>
              <Grid container>
                <Grid item xs={12} lg={12}>
                  <AmortismanVeriYukleme />
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="Hesaplama" sx={{ paddingX: 0 }}>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  lg={12}
                  sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
                >
                  <CustomSelect
                    labelId="hesaplamaYontemi"
                    id="hesaplamaYontemi"
                    size="small"
                    value={hesaplamaYontemi}
                    onChange={handleChange}
                    height={"36px"}
                  >
                    <MenuItem value={"Aylık"}>
                      Hesaplama Yöntemi: Aylık
                    </MenuItem>
                    <MenuItem value={"Günlük"}>
                      Hesaplama Yöntemi: Günlük
                    </MenuItem>
                  </CustomSelect>
                  <Button
                    type="button"
                    size="medium"
                    disabled={hesaplaTiklandimi}
                    variant="outlined"
                    color="primary"
                    sx={{ ml: 2 }}
                    onClick={() => {
                      setHesaplaTiklandimi(true);
                      handleHesapla();
                    }}
                  >
                    Hesapla
                  </Button>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <AmortismanHesaplama hesaplaTiklandimi={hesaplaTiklandimi} />
                </Grid>
                {openCartAlert && (
                  <InfoAlertCart
                    openCartAlert={openCartAlert}
                    setOpenCartAlert={setOpenCartAlert}
                  ></InfoAlertCart>
                )}
              </Grid>
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Page;
