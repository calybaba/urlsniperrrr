import fetch from "node-fetch";
import Socket from "ws";
import {
  SNIPER_GUILD_ID,
  SNIPER_SELF_TOKEN,
  URL_SNIPER_SELF_TOKEN,
  WEBHOOKS,
} from "../contants";
import guilds from "../guilds";
export default class Sniper {
  opcodes = {
    DISPATCH: 0,
    HEARTBEAT: 1,
    IDENTIFY: 2,
    RECONNECT: 7,
    HELLO: 10,
    HEARTBEAT_ACK: 11,
  };
  socket: Socket;
  interval: any = null;
  createPayload = (data: any): string => JSON.stringify(data);
  constructor() {
    this.socket = new Socket("wss://gateway.discord.gg/?v=10&encoding=json");
    this.socket.on("open", () => {
      console.log("Discord WebSocket connection opened.");
      this.socket.on("message", async (message: string) => {
        const data: { op: number; d: any; s: number; t: string } =
          JSON.parse(message);
        if (data.op === this.opcodes.DISPATCH) {
          if (data.t === "GUILD_UPDATE") {
            const find = guilds[data.d.guild_id];
            console.log(data.d)
            if (typeof find?.vanity_url_code === 'string' && find.vanity_url_code !== data.d.vanity_url_code) {
              fetch(
                `https://discord.com/api/v10/guilds/${SNIPER_GUILD_ID}/vanity-url`,
                {
                  method: "PATCH",
                  body: this.createPayload({
                    code: find.vanity_url_code,
                  }),
                  headers: {
                    Authorization: URL_SNIPER_SELF_TOKEN,
                    "Content-Type": "application/json",
                  },
                }
              ).then(async (res) => {
                if (res.ok) {
                  await WEBHOOKS.SUCCESS(
                    `URL: \`${find.vanity_url_code}\` is successfully sniped. ||@everyone||.`
                  );
                } else {
                  const error = await res.json();
                  await WEBHOOKS.FAIL(`Error while sniping url: **\`${find.vanity_url_code}\`**.
\`\`\`JSON
${JSON.stringify(error, null, 4)}
\`\`\`
`);
                }
                delete guilds[data.d.guild_id];
              }).catch(err => {
                console.log(err)
                return delete guilds[data.d.guild_id]
              })
            }
          } else {
            if (data.t === "READY") {
              data.d.guilds
                .filter((e: any) => typeof e.vanity_url_code === "string")
                .forEach(
                  (e: any) =>
                    (guilds[e.id] = { vanity_url_code: e.vanity_url_code })
                );
              await WEBHOOKS.INFO(`Client is ready with: ${Object.keys(guilds).length
                } urls to be sniped.
${Object.entries(guilds)
                  .map(([key, value]: any) => {
                    return `\`${value.vanity_url_code}\``;
                  })
                  .join(", ")}`);
            } else if (data.t === "GUILD_CREATE") {
              guilds[data.d.id] = { vanity_url_code: data.d.vanity_url_code };
            }
            else if (data.t === "GUILD_DELETE") {
                          const find = guilds[data.d.id]
            setTimeout(() => {
                if(typeof find?.vanity_url_code === "string") {
              fetch(
                `https://discord.com/api/v10/guilds/${SNIPER_GUILD_ID}/vanity-url`,
                {
                  method: "PATCH",
                  body: this.createPayload({
                    code: find.vanity_url_code,
                  }),
                  headers: {
                    Authorization: URL_SNIPER_SELF_TOKEN,
                    "Content-Type": "application/json",
                  },
                }
              ).then(async (res) => {
                if (res.ok) {
                  await WEBHOOKS.SUCCESS(
                    `URL: \`${find.vanity_url_code}\` is successfully sniped. ||@everyone||`
                  );
                } else {
                  const error = await res.json();
                  await WEBHOOKS.FAIL(`Error while sniping url: **\`${find.vanity_url_code}\`**.
\`\`\`JSON
${JSON.stringify(error, null, 4)}
\`\`\`
`);
                }
                delete guilds[data.d.guild_id];
              }).catch(err => {
                console.log(err)
                return delete guilds[data.d.guild_id]
              })
            }
            }, 25);
              }
          }
        } else if (data.op === this.opcodes.RECONNECT) return process.exit()
        else if (data.op === this.opcodes.HELLO) {
          clearInterval(this.interval);
          this.interval = setInterval(
            () => this.heartbeat(),
            data.d.heartbeat_interval
          );
          this.socket.send(
            this.createPayload({
              op: this.opcodes.IDENTIFY,
              d: {
                token: SNIPER_SELF_TOKEN,
                intents: 1,
                properties: {
                  os: "macos",
                  browser: "Safari",
                  device: "MacBook Air",
                },
              },
            })
          );
        }
      });
      this.socket.on("close", (reason) => {
console.log('Websocket connection closed by discord', reason)
return process.exit()
});
      this.socket.on("error", (error) => {
        console.log(error);
        process.exit();
      });
    });
  }
  private heartbeat = () => {
    return this.socket.send(
      this.createPayload({
        op: 1,
        d: {},
        s: null,
        t: "heartbeat",
      })
    );
  };
}