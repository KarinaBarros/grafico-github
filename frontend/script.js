async function fetchGithub() {
    const app = document.getElementById("app");

    try {
        const response = await fetch("http://localhost:3000/github");
        const data = await response.json();

        const { meses, github } = data;

        app.innerHTML = "";

        const title = document.createElement("h3");
        title.innerText = `${github.totalContributions} contribuições no último ano`;

        const mesesDiv = document.createElement("div");
        mesesDiv.className = "meses";

        meses.forEach(mes => {
            const p = document.createElement("p");
            p.innerText = mes;
            mesesDiv.appendChild(p);
        });

        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        const semanaDiv = document.createElement("div");
        semanaDiv.className = "semana";

        ["Seg", "Qua", "Sex"].forEach(dia => {
            const span = document.createElement("span");
            span.innerText = dia;
            semanaDiv.appendChild(span);
        });

        const grafico = document.createElement("div");
        grafico.appendChild(semanaDiv)
        grafico.className = "grafico";

        github.weeks.forEach((semana, index) => {
            const coluna = document.createElement("div");
            coluna.className = "coluna";

            if (index === 0) {
                coluna.classList.add("end");
            }

            semana.contributionDays.forEach(dia => {
                const d = document.createElement("div");
                d.className = "dia";
                d.style.backgroundColor = dia.color;

                d.title = `${dia.contributionCount} contribuições em ${dia.date}`;

                coluna.appendChild(d);
            });

            grafico.appendChild(coluna);
        });

        cardDiv.appendChild(mesesDiv);
        cardDiv.appendChild(grafico);

        app.appendChild(title);
        app.appendChild(cardDiv);

    } catch (err) {
        console.log(err);
        app.innerHTML = "Erro ao carregar";
    }
}

fetchGithub();