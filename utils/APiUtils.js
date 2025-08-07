const { expect } = require("@playwright/test");

class APiUtils {

    // apiContext: Playwright's API testing context (request.newContext()).
    // loginPayLoad: Object containing username/password for login.

    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;

    }

    async getToken() {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
            {
                data: this.loginPayLoad
            })
        //200,201,
        // The loginResponse is a Response object, which contains metadata (like status, headers, etc.) and the body — but the body is still in raw format (a stream).
        // To actually read the body content, you need to parse it into a usable JavaScript object. That’s what .json() does:
        const loginResponseJson = await loginResponse.json();
        // verify the login response return code status 200 or 201
        expect(loginResponse.ok()).toBeTruthy();
        const token = loginResponseJson.token;
        console.log(token);
        return token;

    }

    async createOrder(orderPayLoad) {
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayLoad,
                headers: {
                    'Authorization': response.token,
                    'Content-Type': 'application/json'
                },
            })
        const orderResponseJson = await orderResponse.json();
        console.log(orderResponseJson); // return oderId, or error message
        // Parses the response to extract the first order ID.
        const orderId = orderResponseJson.orders[0]; // orders is an array return in the response "orders": ["orderId1", "orderId2"],
        response.orderId = orderId;

        return response;
    }



}
module.exports = { APiUtils };




