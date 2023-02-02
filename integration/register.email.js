require("dotenv").config();

const supertest = require("supertest");
const mongoose = require("mongoose");
const { app } = require("./../../app");
const { User } = require("../../models/users");

mongoose.set("strictQuery", false);

const { SENDGRID_API_KEY } = process.env;

describe("register", () => {
    beforeAll(async () => {
        await mongoose.connect(SENDGRID_API_KEY);

        await User.deleteMany();
    });

    afterAll(async () => {
        await mongoose.disconnect(SENDGRID_API_KEY);
    });

    it("should register new user", async () => {
        const response = await supertest(app).post("/api/auth/register").send({
            email: "YulyaFed86@gmail.com",
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.data.user.email).toBe("YulyaFed86@gmail.com");
    });

    it("should not register the same user 2 times", async () => {
        await supertest(app).post("/api/auth/register").send({
            email: "YulyaFed86@gmail.com",
        });

        const response = await supertest(app).post("/api/auth/register").send({
            email: "YulyaFed86@gmail.com",
        });
        //
        expect(response.statusCode).toBe(409);
    });
});