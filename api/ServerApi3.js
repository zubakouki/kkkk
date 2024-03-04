const axios = require("axios");
const { itemsType } = require("../Constants/Kits");

class Famishs {
    constructor() {
        this.password = "36@_colddfun_69";
        this.apiBaseUrl = "https://portal.famishs.io";
    }

    async managePlayer(id, server, other) {
        let apiUrl = `/change-skin/?player_id=${id}&server_name=${server}&password=${this.password}`;

        if (other.skin) {
            apiUrl += `&skin_id=${other.skin}`;
        }
        if (other.accessory) {
            apiUrl += `&accessory_id=${other.accessory}`;
        }
        if (other.bag) {
            apiUrl += `&bag_id=${other.bag}`;
        }

        return await this.callAPI(apiUrl, "get");
    }

    async sendKitToPlayer(id, server, kit) {
        let apiUrl = `/send/?player_id=${id}&server_name=${server}&password=${this.password}&items=${JSON.stringify(kit)}`;

        return await this.callAPI(apiUrl, "get");
    }

    async callAPI(apiUrl, type, data) {
        try {
            if (type == "get") {
                const response = await axios.get(this.apiBaseUrl + apiUrl);
                console.log(response.data, response.status);
                return response;
            } else {
                const response = await axios.post(
                    this.apiBaseUrl + apiUrl,
                    JSON.stringify(data)
                );
                console.log(response.data, response.status);
                return response;
            }
        } catch (err) {
            console.log(`Something went wrong in API call!`, JSON.stringify(err));
        }
    }
}

module.exports = Famishs;
