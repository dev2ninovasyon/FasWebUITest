"use client";

import PageContainer from "@/app/(Uygulama)/components/Container/PageContainer";
import Breadcrumb from "@/app/(Uygulama)/components/Layout/Shared/Breadcrumb/Breadcrumb";
import { Button, Grid, MenuItem, useTheme } from "@mui/material";
import { AppState } from "@/store/store";
import { useSelector } from "react-redux";
import CustomSelect from "@/app/(Uygulama)/components/Forms/ThemeElements/CustomSelect";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { updateDenetlenenDenetimTuru } from "@/api/Musteri/MusteriIslemleri";
import { useDispatch } from "@/store/hooks";
import { setDenetimTuru } from "@/store/user/UserSlice";

const BCrumb = [
  {
    to: "/Musteri",
    title: "Müşteri",
  },
  {
    to: "/Musteri/MusteriKabul",
    title: "Müşteri Kabul",
  },
];

const Page: React.FC = () => {
  const user = useSelector((state: AppState) => state.userReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  const dispatch = useDispatch();

  const [tur, setTur] = useState("Bobi");
  const handleChangeTur = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTur(event.target.value);
  };

  const [enflasyon, setEnflasyon] = useState("Hayır");
  const handleChangeEnflasyon = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEnflasyon(event.target.value);
  };

  const [hesaplaTiklandimi, setHesaplaTiklandimi] = useState(false);

  const handleDenetimeKabulEt = async () => {
    try {
      const result = await updateDenetlenenDenetimTuru(
        user.token || "",
        user.denetlenenId || 0,
        tur,
        enflasyon
      );
      if (result) {
        setHesaplaTiklandimi(false);
        await dispatch(setDenetimTuru(tur));

        enqueueSnackbar("Denetime Kabul Edildi", {
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
        enqueueSnackbar("Denetime Kabul Edilemedi", {
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

  return (
    <PageContainer title="Müşteri Kabul" description="Müşteri Kabul">
      <Breadcrumb title="Müşteri Kabul" items={BCrumb} />
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          lg={12}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <CustomSelect
            labelId="tur"
            id="tur"
            size="small"
            value={tur}
            onChange={handleChangeTur}
            height={"36px"}
          >
            <MenuItem value={"Bobi"}>Denetim Türü: Bobi</MenuItem>
            <MenuItem value={"BobiBüyük"}>Denetim Türü: Bobi Büyük</MenuItem>
            <MenuItem value={"Tfrs"}>Denetim Türü: Tfrs</MenuItem>
            <MenuItem value={"TfrsDönemsel"}>
              Denetim Türü: Tfrs Dönemsel
            </MenuItem>
            <MenuItem value={"ÖzelDenetim"}>
              Denetim Türü: Özel Denetim
            </MenuItem>
          </CustomSelect>
          <CustomSelect
            labelId="enflasyon"
            id="enflasyon"
            size="small"
            value={enflasyon}
            onChange={handleChangeEnflasyon}
            height={"36px"}
          >
            <MenuItem value={"Evet"}>
              Enflasyon Düzeltmesi Uygulanacak Mı: Evet
            </MenuItem>
            <MenuItem value={"Hayır"}>
              Enflasyon Düzeltmesi Uygulanacak Mı: Hayır
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
              handleDenetimeKabulEt();
            }}
          >
            Denetime Kabul Et
          </Button>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Page;
