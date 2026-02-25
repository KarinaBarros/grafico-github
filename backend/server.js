import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../frontend");

app.use(express.static(frontendPath));


app.get("/github", async (req, res) => {
    const dataAtual = new Date();
    const dataInicial = new Date(dataAtual);
    dataInicial.setFullYear(dataAtual.getFullYear() - 1);

    try {
        const query = `
        {
          user(login: "KarinaBarros") {
            contributionsCollection(from: "${dataInicial.toISOString()}", to: "${dataAtual.toISOString()}") {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    color
                  }
                }
              }
            }
          }
        }
        `;

        const response = await axios.post(
            "https://api.github.com/graphql",
            { query },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB}`,
                },
            }
        );

        let meses = [];
        let dataTemp = new Date(dataInicial);

        while (dataTemp <= dataAtual) {
            let mes = dataTemp.toLocaleString("pt-BR", { month: "short" });
            mes = mes.charAt(0).toUpperCase() + mes.slice(1).replace(".", "");
            meses.push(mes);
            dataTemp.setMonth(dataTemp.getMonth() + 1);
        }

        res.json({
            meses,
            github: response.data.data.user.contributionsCollection.contributionCalendar,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao buscar dados" });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});