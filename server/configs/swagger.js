import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chatzy API",
      version: "1.0.0",
      description: "API documentation for Chatzy chat application",
      contact: {
        name: "API Support",
        email: "suyash.2023ug1100@iiitranchi.ac.in",
      },
      license: {
        name: "GNU General Public License v3.0",
        url: "https://www.gnu.org/licenses/gpl-3.0.html",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://chatzy-mxp8.onrender.com/"
            : `http://localhost:${process.env.PORT || 5000}`,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
