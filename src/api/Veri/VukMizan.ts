import { url } from "@/api/apiBase";

export const getVukMizanVerileriByDenetciDenetlenenYil = async (
  token: string,
  denetciId: number,
  denetlenenId: number,
  yil: number
) => {
  try {
    const response = await fetch(
      `${url}/Veri/VukMizan?denetciId=${denetciId}&yil=${yil}&denetlenenId=${denetlenenId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      return response.json();
    } else {
      console.error("Vuk Mizan verileri getirilemedi");
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const createVukMizanVerisi = async (
  token: string,
  createdVukMizan: any
) => {
  try {
    const response = await fetch(`${url}/Veri/VukMizan`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(createdVukMizan),
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const createMultipleVukMizanVerisi = async (
  token: string,
  jsonData: any
) => {
  try {
    const response = await fetch(`${url}/Veri/VukMizanMultiple`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jsonData),
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const createNullVukMizanVerisi = async (
  token: string,
  denetciId: number,
  denetlenenId: number,
  yil: number,
  siraNo: number
) => {
  try {
    const response = await fetch(
      `${url}/Veri/VukMizanNull?denetciId=${denetciId}&yil=${yil}&denetlenenId=${denetlenenId}&siraNo=${siraNo}`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const updateVukMizanVerisi = async (
  token: string,
  denetciId: number,
  denetlenenId: number,
  yil: number,
  siraNo: number,
  updatedVukMizan: any
) => {
  try {
    const response = await fetch(
      `${url}/Veri/VukMizan?denetciId=${denetciId}&yil=${yil}&denetlenenId=${denetlenenId}&siraNo=${siraNo}`,
      {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedVukMizan),
      }
    );

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const updateMultipleVukMizanVerisi = async (
  token: string,
  denetciId: number,
  denetlenenId: number,
  yil: number,
  siraNo: any
) => {
  try {
    const response = await fetch(
      `${url}/Veri/VukMizanMultiple?denetciId=${denetciId}&yil=${yil}&denetlenenId=${denetlenenId}&siraNo=${siraNo}`,
      {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const deleteVukMizanVerisi = async (
  token: string,
  denetciId: number,
  denetlenenId: number,
  yil: number,
  siraNo: number[]
) => {
  try {
    const response = await fetch(
      `${url}/Veri/VukMizan?denetciId=${denetciId}&yil=${yil}&denetlenenId=${denetlenenId}`,
      {
        method: "DELETE",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(siraNo),
      }
    );

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};
