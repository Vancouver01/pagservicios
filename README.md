# 🛡️ Plataforma IA: DenunciaSegura

**DenunciaSegura** es una plataforma tecnológica omnicanal (WhatsApp + Web App) diseñada para transformar y automatizar el proceso de denuncias ciudadanas en el Perú. Mediante el uso de Inteligencia Artificial (NLP) y validación biométrica, el sistema reduce el tiempo de denuncia de 2 horas a menos de 15 minutos, eliminando la revictimización y garantizando el seguimiento automatizado. 

Este proyecto se enmarca en el **ODS 16: Paz, Justicia e Instituciones Sólidas**.

## 👥 Equipo de Desarrollo (Sección: 24694)
* **Guevara Bustamante, Gabriel Gonzalo**
* **Jaramillo Quispe, Jean Pool**
* **Landa Torres, Anthony**
* **Pablo (Asistente Virtual IA)**

## 🏗️ Arquitectura del Sistema (MVC)
Este repositorio funciona como un **Monorepo** que contiene tanto el frontend como el backend, estructurados en capas:
* **Frontend (`/frontend`):** Aplicación Web desarrollada en React (Interfaces y Dashboard en modo oscuro).
* **Backend (`/backend`):** API REST desarrollada en Spring Boot (Java) con arquitectura Modelo-Vista-Controlador.
* **Integraciones:**
  * API RENIEC (Validación de identidad en tiempo real).
  * NLP / OpenAI (Extracción de entidades desde audios de WhatsApp).
  * API SIDPOL (Interoperabilidad con los sistemas policiales).
* **Base de Datos:** MySQL desplegada en AWS RDS.

## 📂 Estructura del Repositorio
```text
denuncia-segura-app/
├── docs/          # Diagramas de arquitectura, wireframes y Cuadro PDCA
├── frontend/      # Código fuente de la UI (React App)
└── backend/       # Código fuente de los Controladores, Servicios y Modelos (Spring Boot)