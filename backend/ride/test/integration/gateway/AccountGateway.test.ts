import crypto from "crypto";
import {AccountGateway} from "../../../src/infra/gateway/AccountGateway";

describe("Account Gateway", () => {
    it("Should not find account by id", async () => {
        const accountGateway = new AccountGateway();
        const accountId = crypto.randomUUID();
        const account = await accountGateway.findById(accountId);
        expect(account).toBeNull();
    });
});