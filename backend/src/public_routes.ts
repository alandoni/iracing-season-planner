import { Routes } from "backend/routes/routes"
import path from "path"
import express from "express"
import { Router } from "backend/server_interface"

export class PublicRoute implements Routes {
  use(router: Router): void {
    const buildPath = process.env.NODE_ENV === "production" ? "../../" : "../../build"

    router.use(express.static(path.resolve(__dirname, buildPath)))
    router.get("/*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, buildPath, "index.html"))
    })
  }
}
