☕ BREWBOX – E-commerce de Café con Angular + Supabase

Aplicación web desarrollada con Angular y Supabase que simula una tienda online de granos de café y máquinas de café, aplicando arquitectura limpia, CRUD completo y patrones de UX modernos.

🔗 Deploy: (https://brewbox-angular-1bx5g3axu-gufilo36-5617s-projects.vercel.app/)
🔗 Repositorio: https://github.com/GuttyBenitez35/brewbox-angular

📸 Vista general

BrewBox permite a los usuarios:

Explorar catálogo de productos
Registrarse e iniciar sesión
Agregar productos al carrito
Persistir carrito entre sesiones
Realizar pedidos
Gestionar estado de compra
🚀 Tecnologías utilizadas
Angular 17
TypeScript
Tailwind CSS
Supabase (Auth + Database)
RxJS
Vercel (deploy)

Backend serverless usando Supabase.

🧠 Arquitectura del proyecto

El proyecto sigue una arquitectura por capas basada en buenas prácticas de Angular.

src/app
│
├── core/            → Guards y seguridad
├── models/          → Interfaces tipadas
├── services/        → Lógica de negocio + Supabase
├── shared/          → Componentes reutilizables
├── pages/           → Vistas principales (SPA)
└── pipes/           → Transformación de datos
Capas

Presentation Layer

Componentes y páginas
Manejan UI y eventos

Business Logic Layer

Servicios Angular
Encapsulan lógica del sistema

Data Layer

SupabaseService centraliza acceso a BD

Models Layer

Interfaces TypeScript fuertemente tipadas
🔐 Integración con Supabase

La aplicación utiliza Supabase para:

Autenticación de usuarios
Persistencia del carrito
Gestión de productos
Gestión de pedidos

Se utilizan variables de entorno para proteger credenciales.

🛒 Funcionalidades principales (CRUD)
Productos
Ver catálogo
Ver detalles
Carrito
Agregar productos
Modificar cantidades
Eliminar productos
Persistencia en la nube
Pedidos
Crear pedidos
Guardar historial
🎨 Patrones UX implementados

Se aplicaron múltiples patrones de diseño UX para mejorar la experiencia del usuario:

Patrón	Implementación
Skeleton Loading	Tarjetas animadas mientras cargan productos
Feedback Visual	Notificaciones toast al agregar al carrito
Validación en tiempo real	Formularios reactivos
Microinteracciones	Animaciones hover y transiciones
Loading en botones	Spinner en procesos
Estado vacío	CTA cuando el carrito está vacío
Persistencia del carrito	Sincronización entre sesiones
Navegación contextual	“Seguir comprando” desde carrito
🗄️ Modelo de Base de Datos

Tablas principales en Supabase:

perfiles
productos
carrito_items
pedidos
pedido_items

Relaciones:

Usuario → Carrito (1:N)
Usuario → Pedidos (1:N)
Pedido → Items (1:N)
⚙️ Instalación local
git clone https://github.com/TU-USUARIO/brewbox-angular.git
cd brewbox-angular
npm install
ng serve

Abrir en:

http://localhost:4200
🧪 Variables de entorno

Crear archivo:

src/environments/environment.ts

Ejemplo:

export const environment = {
  production: false,
  supabaseUrl: 'TU_URL',
  supabaseKey: 'TU_KEY'
};
🌍 Deploy en producción

Proyecto desplegado en Vercel.

Cada push a la rama main genera despliegue automático.

👨‍💻 Autor

Proyecto académico desarrollado para la materia de Desarrollo Web.

📌 Estado del proyecto

✅ Arquitectura Angular completa
✅ CRUD funcional con Supabase
✅ Patrones UX implementados
✅ Deploy en producción
✅ Documentación UML incluida
