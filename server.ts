import app from "./api/index";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const PORT = Number(process.env.PORT) || 3000;


async function startLocalServer() {
  const publicPath = path.join(process.cwd(), "public");
  app.get(["/home-v5", "/home-v5/", "/home5", "/home5/"], (_req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.sendFile(path.join(publicPath, "home-v5", "index.html"));
  });
  app.get(["/goodfella", "/goodfella/"], (_req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.sendFile(path.join(publicPath, "goodfella", "index.html"));
  });
  app.get(["/", "/en", "/en/", "/enerblock", "/enerblock/"], (_req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.sendFile(path.join(publicPath, "en", "index.html"));
  });
  app.use(express.static(publicPath, { etag: false, maxAge: 0 }));

  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    app.get("/portfolio-projetos*", (req, res, next) => {
      req.url = "/portfolio-projetos/index.html";
      next();
    });
    app.get("/portfolioedu*", (req, res, next) => {
      req.url = "/portfolioedu/index.html";
      next();
    });
    app.get("/admin*", (req, res, next) => {
      req.url = "/admin/index.html";
      next();
    });
    app.get("/sobre*", (req, res, next) => {
      req.url = "/sobre/index.html";
      next();
    });
    app.get("/piassa*", (req, res, next) => {
      req.url = "/piassa/index.html";
      next();
    });
    app.get("/baseproposta*", (req, res, next) => {
      req.url = "/baseproposta/index.html";
      next();
    });
    app.get("/home-v2*", (req, res, next) => {
      req.url = "/home-v2/index.html";
      next();
    });
    app.get("/home2*", (req, res, next) => {
      req.url = "/home-v2/index.html";
      next();
    });
    app.get("/home-v4*", (req, res, next) => {
      req.url = "/home-v4/index.html";
      next();
    });
    app.get("/home4*", (req, res, next) => {
      req.url = "/home-v4/index.html";
      next();
    });
    app.get("/home-v5*", (req, res, next) => {
      req.url = "/home-v5/index.html";
      next();
    });
    app.get("/home5*", (req, res, next) => {
      req.url = "/home-v5/index.html";
      next();
    });
    app.get("/home-v6*", (req, res, next) => {
      req.url = "/home-v6/index.html";
      next();
    });
    app.get("/home6*", (req, res, next) => {
      req.url = "/home-v6/index.html";
      next();
    });
    app.get("/proposta-escom-*", (req, res, next) => {
      req.url = "/baseproposta/index.html";
      next();
    });
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "mpa",
    });
    app.use(vite.middlewares);

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`[SECURE_SERVER] Running on http://localhost:${PORT}`);
      console.log(`[SECURE_SERVER] Direct IP: http://127.0.0.1:${PORT}`);
      console.log(`[ENVIRONMENT] ${process.env.NODE_ENV || 'development'}`);
    });

    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

    server.on("error", (err) => {
      console.error("[SERVER_ERROR]", err);
    });

    process.on("uncaughtException", (err) => {
      console.error("[UNCAUGHT_EXCEPTION]", err);
    });

    process.on("unhandledRejection", (err) => {
      console.error("[UNHANDLED_REJECTION]", err);
    });
  } else if (!process.env.VERCEL) {
    // Local production fallback (e.g. self-hosted VPS)
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("/portfolio-projetos*", (req, res) => {
      res.sendFile(path.join(distPath, "portfolio-projetos", "index.html"));
    });
    app.get("/portfolioedu*", (req, res) => {
      res.sendFile(path.join(distPath, "portfolioedu", "index.html"));
    });
    app.get("/admin*", (req, res) => {
      res.sendFile(path.join(distPath, "admin", "index.html"));
    });
    app.get("/sobre*", (req, res) => {
      res.sendFile(path.join(distPath, "sobre", "index.html"));
    });
    app.get("/piassa*", (req, res) => {
      res.sendFile(path.join(distPath, "piassa", "index.html"));
    });
    app.get("/baseproposta*", (req, res) => {
      res.sendFile(path.join(distPath, "baseproposta", "index.html"));
    });
    app.get("/home-v4*", (req, res) => {
      res.sendFile(path.join(distPath, "home-v4", "index.html"));
    });
    app.get("/home4*", (req, res) => {
      res.sendFile(path.join(distPath, "home-v4", "index.html"));
    });
    app.get("/home-v5*", (req, res) => {
      res.sendFile(path.join(distPath, "home-v5", "index.html"));
    });
    app.get("/home5*", (req, res) => {
      res.sendFile(path.join(distPath, "home-v5", "index.html"));
    });
    app.get("/home-v6*", (req, res) => {
      res.sendFile(path.join(distPath, "home-v6", "index.html"));
    });
    app.get("/home6*", (req, res) => {
      res.sendFile(path.join(distPath, "home-v6", "index.html"));
    });
    app.get("/proposta-escom-*", (req, res) => {
      res.sendFile(path.join(distPath, "baseproposta", "index.html"));
    });
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[SECURE_SERVER] Running local production on http://localhost:${PORT}`);
    });
  }
}

startLocalServer();

export default app;
