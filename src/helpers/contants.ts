import fetch from "node-fetch";

export const SNIPER_GUILD_ID = "1073579330850017302";
export const SNIPER_SELF_TOKEN = "MTAyODM2MzUxMDk4NTU0MzY5MA.GnpLwj.uygthsMhwm-riw70iA9kSk7yK3rrdr683tJtKk";
export const URL_SNIPER_SELF_TOKEN = 
 "MTAyODM2MzUxMDk4NTU0MzY5MA.GgNIbh.XgNrBx1zRDiPPCHyxUuRb0y7Jd3yX1s_aASY-w";
export const WEBHOOKS = {
  SUCCESS: async (content: string) => {
    await fetch(
      `https://discord.com/api/webhooks/1076228649059098745/sBHigpY49lONVj632J3pAxKrgoDE3qj6RlRl3yhgQ_vtmJVpGpFHC1bAOKBT44OjCT3u`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          username: "SUCCESS",
        }),
      }
    );
  },
  INFO: async (content: string) => {
    await fetch(
      `https://discord.com/api/webhooks/1076228577885954110/magYBq884gmcbFBfnEk8qa3b_4o_mGwQ4L1iiEQcaHH8MJWTVHk95JW3cPTvffm8T6Rz`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          username: "INFO",
        }),
      }
    );
  },

  FAIL: async (content: string) => {
    await fetch(
      `https://discord.com/api/webhooks/1076228850066927616/4WpHPlCOr5Pu22nDcNlDzt7LnQK_cuS3o3KNz8BG1rIPAg8iQXhBri5dgWgG1N_w4cKX`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          username: "FAIL",
        }),
      }
    );
  },
};
