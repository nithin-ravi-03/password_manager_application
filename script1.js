function maskPassword(pass) {
    return "•".repeat(pass.length);
}

function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            document.getElementById("alert").style.display = "inline";
            setTimeout(() => {
                document.getElementById("alert").style.display = "none";
            }, 2000);
        },
        () => {
            alert("Clipboard copying failed");
        }
    );
}

function validateForm() {
    let isValid = true;
    const website = document.getElementById("website").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Reset error messages
    document.getElementById("website-error").textContent = "";
    document.getElementById("username-error").textContent = "";
    document.getElementById("password-error").textContent = "";

    // Website validation
    if (!website) {
        document.getElementById("website-error").textContent = "Website is required";
        isValid = false;
    }

    // Username validation
    if (!username) {
        document.getElementById("username-error").textContent = "Username is required";
        isValid = false;
    }

    // Password validation
    if (!password) {
        document.getElementById("password-error").textContent = "Password is required";
        isValid = false;
    } else if (password.length < 8) {
        document.getElementById("password-error").textContent = "Password must be at least 8 characters long";
        isValid = false;
    }

    return isValid;
}

const deletePassword = (website) => {
    if (confirm(`Are you sure you want to delete the password for ${website}?`)) {
        let data = localStorage.getItem("passwords");
        let arr = JSON.parse(data);
        arrUpdated = arr.filter((e) => {
            return e.website != website;
        });
        localStorage.setItem("passwords", JSON.stringify(arrUpdated));
        showPasswords();
    }
}

const showPasswords = () => {
    let tb = document.querySelector("table");
    let data = localStorage.getItem("passwords");
    if (data == null || JSON.parse(data).length == 0) {
        tb.innerHTML = `<tr>
            <th>Website</th>
            <th>Username</th>
            <th>Password</th>
            <th>Delete</th>
        </tr>
        <tr>
            <td colspan="4" style="text-align: center;">No passwords saved yet</td>
        </tr>`;
    } else {
        tb.innerHTML = `<tr>
            <th>Website</th>
            <th>Username</th>
            <th>Password</th>
            <th>Delete</th>
        </tr>`;
        let arr = JSON.parse(data);
        let str = "";
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            str += `<tr>
                <td>${element.website} <img class="copy-icon" onclick="copyText('${element.website}')" src="./copy.svg" alt="Copy Button"></td>
                <td>${element.username} <img class="copy-icon" onclick="copyText('${element.username}')" src="./copy.svg" alt="Copy Button"></td>
                <td>${maskPassword(element.password)} <img class="copy-icon" onclick="copyText('${element.password}')" src="./copy.svg" alt="Copy Button"></td>
                <td><button class="btnsm" onclick="deletePassword('${element.website}')">Delete</button></td>
            </tr>`;
        }
        tb.innerHTML = tb.innerHTML + str;
    }
}

document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const websiteValue = website.value.trim();
    const usernameValue = username.value.trim();
    const passwordValue = password.value;

    let passwords = localStorage.getItem("passwords");
    
    // Check if password for this website already exists
    if (passwords) {
        let existingPasswords = JSON.parse(passwords);
        if (existingPasswords.some(p => p.website === websiteValue)) {
            if (!confirm(`A password for ${websiteValue} already exists. Do you want to update it?`)) {
                return;
            }
            existingPasswords = existingPasswords.filter(p => p.website !== websiteValue);
            passwords = JSON.stringify(existingPasswords);
        }
    }

    if (passwords == null) {
        let json = [];
        json.push({ website: websiteValue, username: usernameValue, password: passwordValue });
        localStorage.setItem("passwords", JSON.stringify(json));
    } else {
        let json = JSON.parse(passwords);
        json.push({ website: websiteValue, username: usernameValue, password: passwordValue });
        localStorage.setItem("passwords", JSON.stringify(json));
    }

    // Clear form
    document.getElementById("passwordForm").reset();
    showPasswords();
});

// Initialize the password list
showPasswords();