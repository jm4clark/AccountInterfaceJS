function makeRequest(requestType, url, sendData) {
    return new Promise((res, rej) => {
        let req = new XMLHttpRequest();
        req.onload = () => {
            if (req.status >= 200 && req.status <= 299) {
                res(req);
            } else {
                rej(req);
            }
        }
        req.open(requestType, url);

        req.send(sendData);
    });
}

function get(id) {
    makeRequest("GET", `http://localhost:8080/AccountSETemplate/api/account/getAnAccount/${id}`).then((req) => {
        removeAllChildren("result");
        let acc = JSON.parse(req.responseText);
        cardMaker(acc, "result");
    }).catch(() => { result.innerText = "No account exists"; });
}

function getAll() {
    makeRequest("GET", `http://localhost:8080/AccountSETemplate/api/account/getAllAccounts`).then((req) => {
        removeAllChildren("result");
        // for (let a in JSON.parse(req.responseText)) {
        //     cardMaker(a, "result");
        // }
        let jsonData = JSON.parse(req.responseText);
        for(let i = 0; i < jsonData.length; i++){
            cardMaker(jsonData[i], "result");
        }
    }).catch(() => { result.innerText = "No accounts"; });
}

function post(accNum, fName, lName) {
    let acc = accountMaker(accNum, fName, lName);

    makeRequest("POST", "http://localhost:8080/AccountSETemplate/api/account/createAccount", JSON.stringify(acc)).then(() => {
        creResult.innerText = "Account created!";
    });
}

function deleteAcc(id) {
    makeRequest("DELETE", `http://localhost:8080/AccountSETemplate/api/account/deleteAccount/${id}`).then((req) => {
        delResult.innerText = "Account deleted!";
    }).catch(() => {
        delResult.innerText = "No account to delete!";
    });
}

function update(id, accNo, fName, lName) {
    let acc = accountMaker(accNo, fName, lName);
    console.log(acc);
    makeRequest("PUT", `http://localhost:8080/AccountSETemplate/api/account/updateAccount/${id}`, JSON.stringify(acc)).then((req) => {
        updResult.innerText = "Account updated!";
    }).catch(() => {
        updResult.innerText = "No account to update!";
    });
}

function accountMaker(accNumber, firstName, lastName) {
    const account = {
        accountNumber: accNumber.value,
        firstName: firstName.value,
        lastName: lastName.value
    };
    return account;
}

function cardMaker(account, id) {
    let card = document.createElement("div");
    card.innerHTML = `<div class="card" style="width: 18rem;">
                <img class="card-img-top" src="profile${account.id}.jpg" onerror="this.onerror=null; this.src='defaultpic.jpg'" alt="no profile picture found">
                <div class="card-body">
                    <h5 class="card-title">Account ${account.accountNumber}</h5>
                    <p class="card-text">${account.firstName} ${account.lastName}</p>                   
                </div>
            </div>`;
    document.getElementById(id).appendChild(card);
}

function removeAllChildren(id) {
    let result = document.getElementById(id);
    while(result.hasChildNodes()){
        result.removeChild(result.firstChild);
    }
}