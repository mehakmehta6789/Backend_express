document.getElementsByTagName("h2")[0].innerHTML = "Contact Details";

fetch("http://localhost:3000/contactdata")
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);

        const table = document.createElement('table');
        const tableBody = document.createElement('tbody');

        data.forEach(person => {
            const row = document.createElement('tr');
            // ... (rest of your DOM manipulation code)
            const fnameCell = document.createElement('td');
            const lnameCell = document.createElement('td');
            const fname1Cell = document.createElement('td');
            const lname1Cell = document.createElement('td');
            const emailCell = document.createElement('td');
            const phoneCell = document.createElement('td');
            const addCell = document.createElement('td');
            const add1Cell = document.createElement('td');
            const add2Cell = document.createElement('td');
            const cityCell = document.createElement('td');
            const stateCell = document.createElement('td');
            const codeCell = document.createElement('td');
            const countryCell = document.createElement('td');
            const weddingDateCell = document.createElement('td');
            const catererCell = document.createElement('td');
            const guestCell = document.createElement('td');
            const destCell = document.createElement('td');
            const moreDetailsCell = document.createElement('td');

            fnameCell.textContent = person.fname;
            lnameCell.textContent = person.lname;
            fname1Cell.textContent = person.fname1;
            lname1Cell.textContent = person.lname1;
            emailCell.textContent = person.email;
            phoneCell.textContent = person.phone;
            addCell.textContent = person.add;
            add1Cell.textContent = person.add1;
            add2Cell.textContent = person.add2;
            cityCell.textContent = person.city;
            stateCell.textContent = person.state;
            codeCell.textContent = person.code;
            countryCell.textContent = person.c;
            weddingDateCell.textContent = person.w;
            catererCell.textContent = person.cat;
            guestCell.textContent = person.guest;
            destCell.textContent = person.dest;
            moreDetailsCell.textContent = person.text;

            row.appendChild(fnameCell);
            row.appendChild(lnameCell);
            row.appendChild(fname1Cell);
            row.appendChild(lname1Cell);
            row.appendChild(emailCell);
            row.appendChild(phoneCell);
            row.appendChild(addCell);
            row.appendChild(add1Cell);
            row.appendChild(add2Cell);
            row.appendChild(cityCell);
            row.appendChild(stateCell);
            row.appendChild(codeCell);
            row.appendChild(countryCell);
            row.appendChild(weddingDateCell);
            row.appendChild(catererCell);
            row.appendChild(guestCell);
            row.appendChild(destCell);
            row.appendChild(moreDetailsCell);

            tableBody.appendChild(row);
        });

        table.appendChild(tableBody);
        document.body.appendChild(table);
    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    });