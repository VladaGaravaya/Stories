let SELECTED_STORE_ID;
let COUNT_OF_PRODUCTS;
let PRODUCT;
let STORE;


async function loadList() {
    let url = 'http://localhost:3000/api/Stores?access_token=a';
    let response = await fetch(url);
    let json = await response.json();
    createListIcons(json);
};

async function loadTable(store) {
    let url = `http://localhost:3000/api/Stores/${SELECTED_STORE_ID}/rel_Products?access_token=a`;
    let response = await fetch(url);
    let products = await response.json();
    COUNT_OF_PRODUCTS = products.length;
    createStoreDetails(store, products);
}

function createListIcons (stores) {
    document.getElementById("list").innerHTML = "";
    stores.forEach(store => {
        const li = document.createElement("li");
        li.innerHTML = `<div class="store-name">
                            ${store.Name}  
                        </div>
                        <div class="store-area">
                            <p class="store-number-of-area">${store.FloorArea}</p>
                            sq.m
                        </div>
                        <div style="clear:both"></div>
                        <div class="store-address">
                            ${store.Address}
                        </div>`;
        document.getElementById("list").appendChild(li); 

        li.addEventListener("click", () => {
            SELECTED_STORE_ID = store.id;
            STORE = store;
            loadTable(store);
        }); 
    });
}

function checkVisibilityOfTheStore(store) {
    const stringForSearch = document.getElementById("search").value; 
    return  store.Name.toLowerCase().includes(stringForSearch)|| 
            store.FloorArea.toString().includes(stringForSearch) ||
            store.Address.toLowerCase().includes(stringForSearch);
}

function countsTheNumberOfProductsOfTheSameStatus(products) {
    let ok = 0;
    let outOfStock = 0;
    let storage = 0;
    products.forEach(product => {
        if(product.Status == "OK") {
            ok++; 
        }
        if(product.Status == "OUT_OF_STOCK"){
            outOfStock++;
        }
        if(product.Status == "STORAGE") {
            storage++;
        }
    });
    return [ok, outOfStock, storage];
}

function createStoreDetails(store, products) {
    let [ok, outOfStock, storage] = countsTheNumberOfProductsOfTheSameStatus(products);
    document.getElementById("store-details-container").innerHTML = 
            `<div class="heading">
                Store details
            </div>
            <div class="header">
                
                <div class="store-info">
                    <div>
                        <b>Email:</b> ${store.Email}
                        <br>
                        <b>Phone Number:</b> ${store.PhoneNumber} 
                        <br>
                        <b>Address:</b> ${store.Address}
                    </div>
                    <div>
                        <b>Establlished Date:</b> ${store.Established}
                        <br>
                        <b>Floor Area:</b> ${store.FloorArea}
                    </div>
                </div>
                
                <div class="icons">
                    <div id="count-of-products">
                        ${products.length}
                    </div>
                    <p>All</p>
                    <div id="status-ok">
                        <i class="fa fa-check-square fa-2x" aria-hidden="true"></i>
                        <p class="icons-caption">OK</p>
                    </div>
                    <p>${ok}</p>
                    <div id="status-storage">
                        <i class="fa fa-exclamation-triangle fa-2x" aria-hidden="true"></i>
                        <p class="icons-caption">Storage</p>
                    </div>
                    <p>${storage}</p>
                    <div id="status-out-of-stock">
                        <i class="fa fa-exclamation-circle fa-2x" aria-hidden="true"></i>
                        <p class="icons-caption">Out of stock</p>
                    </div>
                    <p>${outOfStock}</p>
                </div>
            </div>

            <table id="products-table">
                <tr>
                    <td class="name-table" colspan="8">Products</th>
                </tr>
                <tr>
                    <td class="header-table name">Name</td>
                    <td class="header-table price">Price</td>
                    <td class="header-table spect">Specs</td>
                    <td class="header-table sup-info">SupplierInfo</td>
                    <td class="header-table country">Country of origin</td>
                    <td class="header-table company">Prod. company</td>
                    <td class="header-table rating">Rating</td>
                    <td class="header-table" id="cross"> </td>
                </tr>
            </table>
            <div class="footer-store-details">
            <a href="#" id="delete-button"> <i class="fa fa-trash-o" aria-hidden="true"></i> Delete</a>
            <a href="#" id="create-product-button"> + Create</a>
        </div>
        </div>`;
        document.getElementById("delete-button").addEventListener("click", () => {
            if(confirm("Are you sure?")) {
                fetch(`http://localhost:3000/api/Stores/${SELECTED_STORE_ID}?access_token=a`, {
                    method: 'DELETE',
                    headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                    }
                }).then((response) => {
                    if(response.ok) {
                        alert("Store deleted.");
                        loadList();
                    }
                });
                document.getElementById("store-details-container").innerHTML = `
                    <div id="start-page">
                        <i class="fa fa-shopping-basket fa-5x" aria-hidden="true"></i>
                        <br>
                        The store is not selected.
                        <p>Please select the store to proceed.</p>
                    </div>`;
            }
        });
        document.getElementById("create-product-button").addEventListener("click", () => {
            document.getElementById("grey-background").style.visibility = "visible";
        });
        
        showProductListItem(products);
        document.getElementById("status-ok").addEventListener("click", checkStatusOfProductOK(products));
}

function showProductListItem(products) {
    products.forEach(product => {
            const tr = document.createElement("tr"); 
            tr.innerHTML = `<td class="name">${product.Name} <p>${product.id}</p></td>
                            <td class="price"><span>${product.Price}</span> USD</td>
                            <td class="spect">${product.Specs}</td>
                            <td class="sup-info">${product.SupplierInfo}</td>
                            <td class="country">${product.MadeIn}</td>
                            <td class="company">${product.ProductionCompanyName}</td>
                            <td class="rating">
                                <i class="fa fa-star ${(product.Rating < 1)? "": "yellow"}" aria-hidden="true"></i>
                                <i class="fa fa-star ${(product.Rating < 2)? "": "yellow"}" aria-hidden="true"></i>
                                <i class="fa fa-star ${(product.Rating < 3)? "": "yellow"}" aria-hidden="true"></i>
                                <i class="fa fa-star ${(product.Rating < 4)? "": "yellow"}" aria-hidden="true"></i>
                                <i class="fa fa-star ${(product.Rating < 5)? "": "yellow"}" aria-hidden="true"></i>
                            </td>
                            <td class="cross" onclick="deleteProduct(${product.id})"><i class="fa fa-times" aria-hidden="true"></i></td>`;
            document.getElementById("products-table").appendChild(tr);
    });
}

function checkStatusOfProductOK(products) {
    let productWithOK = [];
    products.forEach((product) => {
        if(product.Status === "OK") {
            productWithOK.push(product);
        }
    });
    createStoreDetails(STORE, productWithOK);
}

function deleteProduct(id) {
    if(confirm("Are you sure?")) {
        fetch(`http://localhost:3000/api/Products/${id}?access_token=`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            }
        }).then((response) => {
            if(response.ok) {
                loadTable(STORE);
                alert("Product deleted.");
            }
        });
    } 
}

loadList();

document.getElementById("to-search").addEventListener("click", () => { 
    document.getElementById("list").innerHTML = "";
    const filteredIcons = Stores.filter(checkVisibilityOfTheStore); 
    createListIcons(filteredIcons);
});

document.getElementById("to-refresh").addEventListener("click", () => {
    document.getElementById("search").value = ""; 
    createListIcons(Stores);
});

document.getElementById("create-store").addEventListener("click", () => {
    document.getElementById("back").style.visibility = "visible";
});

document.getElementById("create-store-in-form").addEventListener("click", () => {
    const store = {
        "Name": document.getElementById("name-form-create-store").value,
        "Email": document.getElementById("e-mail").value,
        "PhoneNumber": document.getElementById("phone-number").value,
        "Address": document.getElementById("address").value,
        "Established": document.getElementById("date").value,
        "FloorArea": document.getElementById("floor-area").value
    };
    STORE = store;
      
    fetch('http://localhost:3000/api/Stores?access_token=a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(STORE)
    }).then((response) => {if(response.ok) {
            loadList();
            alert("Store created.")
        }
    });
    document.getElementById("back").style.visibility = "hidden";
});

document.getElementById("cancel").addEventListener("click", () => {
    document.getElementById("back").style.visibility = "hidden";
});

document.getElementById("cancel-2").addEventListener("click", () => {
    document.getElementById("grey-background").style.visibility = "hidden";
});

document.getElementById("create-product-in-form").addEventListener("click", () => {   
    const product = {
        "Name": document.getElementById("product-name").value,
        "Price": document.getElementById("price").value,
        "Photo": "",
        "Specs": document.getElementById("specs").value,
        "Rating": document.getElementById("rating").value,
        "SupplierInfo": document.getElementById("supp-info").value,
        "MadeIn": document.getElementById("country").value,
        "ProductionCompanyName": document.getElementById("company").value,
        "Status": document.getElementById("status").value,
        "StoreId": SELECTED_STORE_ID,
        "id": COUNT_OF_PRODUCTS + 1
    };
    PRODUCT = product;

    fetch('http://localhost:3000/api/Products/replaceOrCreate?access_token=a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(PRODUCT)
    }).then((response) => {
            if(response.ok) {
                loadTable(STORE);
                alert("Product created.");
            }
    });
    document.getElementById("grey-background").style.visibility = "hidden";
});