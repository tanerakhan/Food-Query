var listItem = document.getElementsByClassName('searchList');
var section = document.querySelector('section');

/* var requestURL = 'http://localhost:3004/d'; */
var requestURL = 'https://tanerakhan.com/yemeksepeti/response.php/d';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function () {
    var superHeroes = request.response;
    populateHeader(superHeroes);

}


function search() {
    var input, filter, food, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    food = document.getElementById("foodSearch");
    li = food.getElementsByClassName("searchFound");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}



function template(templateid, data, templateName) {
    var item = document.getElementById(templateName);
    var clone = item.cloneNode(true).outerHTML;
    clone = clone.replace(/style="[^"]*"/g, "");

    clone = clone
        .replace(/%(\w*)%/g, function (m, key) {
            return data.hasOwnProperty(key) ? data[key] : "";
        });
    var tmp = document.createElement('div');
    tmp.className = "tmpTit";
    tmp.innerHTML = clone;
    return tmp;
}

function populateHeader(jsonObj) {
    console.log(jsonObj);
    var x = "";
    var jsonObj, i, j = "";
    var tmp;
    for (i in jsonObj.ResultSet) {
        if (jsonObj.ResultSet[i].DisplayName.length > 0) {
            tmp = template(
                "productList", {
                    product: jsonObj.ResultSet[i].DisplayName
                }, "templateForList"
            );
            document.getElementById("foodSearch").appendChild(tmp);

        }
        for (j in jsonObj.ResultSet[i].Products) {
            if (jsonObj.ResultSet[i].Products[j].ListPrice != "...") {
                tmp = template(
                    "productList", {
                        product: jsonObj.ResultSet[i].Products[j].DisplayName,
                        price: jsonObj.ResultSet[i].Products[j].ListPrice,
                        description: jsonObj.ResultSet[i].Products[j].Description
                    },
                    "templateForListProduct"
                );
                document.getElementById("foodSearch").appendChild(tmp);
            }
        }
    }
    var el = document.getElementById('templateForList');
    var removedChild = el.remove();
    var els = document.getElementById('templateForListProduct');
    var removedChild = els.remove();
}

function addcart(elm) {
    var name = elm.getAttribute("data-name");
    var desc = elm.getAttribute("data-desc");
    var price = elm.getAttribute("data-price");
    document.getElementById("productID").value = (name);
    document.getElementById("_productID").innerHTML = (name);
    document.getElementById("price").value = (price);
    document.getElementById("_price").innerHTML = (price);
    document.getElementById("product_desc").value = (desc);
    document.getElementById("_product_desc").innerHTML = (desc);
    var popupStyle = document.getElementById("popup").style.display = "block";
    var popupStyle = document.getElementById("bgOverlay").style.display = "block";
}

document.getElementById("bgOverlay").addEventListener("click", function (e) {
    e.preventDefault();
    var popupStyle = document.getElementById("popup").style.display = "none";
    var popupStyle = document.getElementById("bgOverlay").style.display = "none";
});
var products = [];
var cart = [];

function addProduct() {
    var productID = document.getElementById("productID").value;
    var product_desc = document.getElementById("product_desc").value;
    var qty = document.getElementById("quantity").value;
    var price = document.getElementById("price").value;

    var newProduct = {
        product_id: null,
        product_desc: null,
        product_qty: 0,
        product_price: 0.00,
    };
    newProduct.product_id = productID;
    newProduct.product_desc = product_desc;
    newProduct.product_qty = qty;
    newProduct.product_price = price;
    products.push(newProduct);
    var html = "<table>";
    html += "<td>Ürün Adı</td>";
    html += "<td>Açıklaması</td>";
    html += "<td>Adet</td>";
    html += "<td>Fiyat</td>";
    html += "<td></td>";
    for (var i = 0; i < products.length; i++) {
        html += "<tr>";
        html += "<td>" + products[i].product_id + "</td>";
        html += "<td>" + products[i].product_desc + "</td>";
        html += "<td>" + products[i].product_qty + "</td>";
        html += "<td>" + products[i].product_price + "</td>";
        html += "<td><button type='submit' class='addDelButton' onClick='deleteProduct(\"" + products[i].product_id + "\", this);'/>Sepetten Sil</button> &nbsp <button type='submit' class='addDelButton' onClick='addCart(\"" + products[i].product_id + "\", this);'/>Sonraki Adım</button></td>";
        html += "</tr>";
    }
    html += "</table>";
    document.getElementById("addToCardDesc").innerHTML = html;
}

function deleteProduct(product_id, e) {
    e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode);
    for (var i = 0; i < products.length; i++) {
        if (products[i].product_id == product_id) {
            products.splice(i, 1);
        }
    }
}

function addCart(product_id) {
    for (var i = 0; i < products.length; i++) {
        if (products[i].product_id == product_id) {
            var cartItem = null;
            for (var k = 0; k < cart.length; k++) {
                if (cart[k].product.product_id == products[i].product_id) {
                    cartItem = cart[k];
                    cart[k].product_qty++;
                    break;
                }
            }
            if (cartItem == null) {
                var cartItem = {
                    product: products[i],
                    product_qty: products[i].product_qty
                };
                cart.push(cartItem);
            }
        }
    }

    renderCartTable();
}

function renderCartTable() {
    var html = '';
    var ele = document.getElementById("addToCardDone");
    ele.innerHTML = '';

    html += "<table id='tblCart'>";
    html += "<tr><td>Ürün Adı</td>";
    html += "<td>Açıklaması</td>";
    html += "<td>Adet</td>";
    html += "<td>Fiyat</td>";
    /*     html += "<td>Toplam</td>";
     */
    html += "<td></td></tr>";
    var GrandTotal = 0;
    for (var i = 0; i < cart.length; i++) {
        html += "<tr>";
        html += "<td>" + cart[i].product.product_id + "</td>";
        html += "<td>" + cart[i].product.product_desc + "</td>";
        html += "<td>" + cart[i].product_qty + "</td>";
        html += "<td>" + cart[i].product.product_price + " TL" + "</td>";
        /*         html += "<td>" + parseFloat(cart[i].product.product_price) * parseInt(cart[i].product_qty) + "</td>";
         */
        html += "<td><button class='quantity' type='submit' onClick='subtractQuantity(\"" + cart[i].product.product_id + "\", this);'/>-</button> &nbsp<button class='quantity' type='submit' onClick='addQuantity(\"" + cart[i].product.product_id + "\", this);'/>+</button> &nbsp<button type='submit' class='removeItem' onClick='removeItem(\"" + cart[i].product.product_id + "\", this);'/>x</button></td>";
        html += "</tr>";

        GrandTotal += parseFloat(cart[i].product.product_price) * parseInt(cart[i].product_qty);

    }
    document.getElementById('totalPriceAmount').innerHTML = GrandTotal + " TL";
    html += "</table>";
    ele.innerHTML = html;
}

function subtractQuantity(product_id) {

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].product.product_id == product_id) {
            cart[i].product_qty--;
        }

        if (cart[i].product_qty == 0) {
            cart.splice(i, 1);
        }
    }
    renderCartTable();
}

function addQuantity(product_id) {

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].product.product_id == product_id) {
            cart[i].product_qty++;
        }
    }
    renderCartTable();
}

function removeItem(product_id) {

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].product.product_id == product_id) {
            cart.splice(i, 1);
        }

    }
    renderCartTable();
}