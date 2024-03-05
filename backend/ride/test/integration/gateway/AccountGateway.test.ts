import crypto from "crypto";
import {AccountGateway} from "../../../src/infra/gateway/AccountGateway";
import sinon from "sinon";
import axios from "axios";
import {AxiosAdapter} from "../../../src/infra/http/HttpClient";

describe("Account Gateway", () => {
    it("Should not find account by id", async () => {
        const accountGateway = new AccountGateway(new AxiosAdapter());
        const accountId = crypto.randomUUID();
        const account = await accountGateway.findById(accountId);
        expect(account).toBeUndefined();
    });
    it("Should find account by id", async () => {
        const accountId = crypto.randomUUID();
        const axiosMock = sinon.mock(axios);
        axiosMock.expects("get").once().resolves(Promise.resolve({data: {accountId: accountId, isDriver: true}}));
        const accountGateway = new AccountGateway(new AxiosAdapter());
        const account = await accountGateway.findById(accountId);
        expect(account?.accountId).toBe(accountId);
        axiosMock.verify();
        axiosMock.restore();
    });
});