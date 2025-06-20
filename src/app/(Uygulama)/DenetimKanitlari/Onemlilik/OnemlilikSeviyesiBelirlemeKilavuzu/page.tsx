"use client";

import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import PageContainer from "@/app/(Uygulama)/components/Container/PageContainer";
import Breadcrumb from "@/app/(Uygulama)/components/Layout/Shared/Breadcrumb/Breadcrumb";
import { getCalismaKagidiVerileriByDenetciDenetlenenYil } from "@/api/CalismaKagitlari/CalismaKagitlari";
import dynamic from "next/dynamic";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import OnemlilikSeviyesi from "./OnemlilikSeviyesi";
import OnemlilikHesaplamaBazi from "./OnemlilikHesaplamaBazi";

const CustomEditorWVeri = dynamic(
  () => import("@/app/(Uygulama)/components/Editor/CustomEditorWVeri"),
  { ssr: false }
);

const BCrumb = [
  {
    to: "/DenetimKanitlari",
    title: "Denetim Kanıtları",
  },
  {
    to: "/DenetimKanitlari/Onemlilik",
    title: "Önemlilik",
  },
  {
    to: "/DenetimKanitlari/Onemlilik/OnemlilikSeviyesiBelirlemeKilavuzu",
    title: "Önemlilik Seviyesi Belirleme Kılavuzu",
  },
];

interface Veri {
  id: number;
  metin: string;
}

const controller = "OnemlilikSeviyesiBelirlemeKilavuzu";

const Page = () => {
  const user = useSelector((state: AppState) => state.userReducer);

  const [veriler, setVeriler] = useState<Veri[]>([]);

  const [hesaplaTiklandimi, setHesaplaTiklandimi] = useState(false);

  const fetchData = async () => {
    try {
      const sozlesmeVerileri =
        await getCalismaKagidiVerileriByDenetciDenetlenenYil(
          controller,
          user.token || "",
          user.denetciId || 0,
          user.denetlenenId || 0,
          user.yil || 0
        );

      if (sozlesmeVerileri?.length > 0) {
        const newVeri = sozlesmeVerileri.map((veri: any) => ({
          id: veri.id,
          metin: veri.metin,
        }));
        setVeriler(newVeri);
      } else {
        console.warn("No data found");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer
      title="Önemlilik Seviyesi Belirleme Kılavuzu"
      description="this is Önemlilik Seviyesi Belirleme Kılavuzu"
    >
      <Breadcrumb
        title="Önemlilik Seviyesi Belirleme Kılavuzu"
        items={BCrumb}
      />

      <Grid container>
        <Grid item xs={12} sm={12} lg={12}>
          <CustomEditorWVeri controller={controller} veri={veriler[0]} />
        </Grid>
        <Box sx={{ width: "95%", margin: "auto", mt: 5 }}>
          <Grid item xs={12} sm={12} lg={12}>
            <OnemlilikSeviyesi
              hesaplaTiklandimi={hesaplaTiklandimi}
              setHesaplaTiklandimi={setHesaplaTiklandimi}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12}>
            <OnemlilikHesaplamaBazi
              hesaplaTiklandimi={hesaplaTiklandimi}
              setHesaplaTiklandimi={setHesaplaTiklandimi}
            />
          </Grid>
        </Box>
      </Grid>
    </PageContainer>
  );
};

export default Page;
