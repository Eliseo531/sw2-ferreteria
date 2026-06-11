-- CreateEnum
CREATE TYPE "EstadoGeneral" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoMovimientoInventario" AS ENUM ('ENTRADA_COMPRA', 'SALIDA_VENTA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO', 'SALIDA_PEDIDO');

-- CreateEnum
CREATE TYPE "EstadoCompra" AS ENUM ('REGISTRADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "TipoCliente" AS ENUM ('MINORISTA', 'CONSTRUCTOR', 'ELECTRICISTA', 'MAYORISTA', 'EMPRESA');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'QR', 'TARJETA', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "EstadoVenta" AS ENUM ('REGISTRADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "OrigenPedido" AS ENUM ('WHATSAPP', 'WEB', 'MOVIL', 'PRESENCIAL');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'EN_REPARTO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoEntrega" AS ENUM ('PENDIENTE', 'EN_CAMINO', 'ENTREGADA', 'FALLIDA');

-- CreateEnum
CREATE TYPE "TipoAlerta" AS ENUM ('STOCK_BAJO', 'DESABASTECIMIENTO', 'ALTA_DEMANDA', 'DOCUMENTO_VENCIDO');

-- CreateEnum
CREATE TYPE "EstadoAlerta" AS ENUM ('PENDIENTE', 'ATENDIDA', 'IGNORADA');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('MANUAL_TECNICO', 'FICHA_SEGURIDAD', 'CERTIFICADO_CALIDAD', 'GARANTIA', 'CONTRATO_PROVEEDOR', 'FACTURA_ESCANEADA', 'COMPROBANTE_ENTREGA');

-- CreateEnum
CREATE TYPE "EstadoBlockchain" AS ENUM ('PENDIENTE', 'REGISTRADO', 'ERROR');

-- CreateTable
CREATE TABLE "usuarios" (
    "idUsuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefono" TEXT,
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "roles" (
    "idRol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("idRol")
);

-- CreateTable
CREATE TABLE "usuario_rol" (
    "idUsuarioRol" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idRol" INTEGER NOT NULL,

    CONSTRAINT "usuario_rol_pkey" PRIMARY KEY ("idUsuarioRol")
);

-- CreateTable
CREATE TABLE "categorias" (
    "idCategoria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("idCategoria")
);

-- CreateTable
CREATE TABLE "marcas" (
    "idMarca" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("idMarca")
);

-- CreateTable
CREATE TABLE "unidades_medida" (
    "idUnidad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,

    CONSTRAINT "unidades_medida_pkey" PRIMARY KEY ("idUnidad")
);

-- CreateTable
CREATE TABLE "almacenes" (
    "idAlmacen" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "descripcion" TEXT,
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "almacenes_pkey" PRIMARY KEY ("idAlmacen")
);

-- CreateTable
CREATE TABLE "ubicaciones_almacen" (
    "idUbicacion" SERIAL NOT NULL,
    "idAlmacen" INTEGER NOT NULL,
    "pasillo" TEXT,
    "estante" TEXT,
    "nivel" TEXT,
    "descripcion" TEXT,

    CONSTRAINT "ubicaciones_almacen_pkey" PRIMARY KEY ("idUbicacion")
);

-- CreateTable
CREATE TABLE "productos" (
    "idProducto" SERIAL NOT NULL,
    "idCategoria" INTEGER NOT NULL,
    "idMarca" INTEGER,
    "idUnidad" INTEGER NOT NULL,
    "idUbicacion" INTEGER,
    "codigoBarras" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioVenta" DECIMAL(10,2) NOT NULL,
    "precioCompraReferencia" DECIMAL(10,2),
    "stockActual" INTEGER NOT NULL DEFAULT 0,
    "stockMinimo" INTEGER NOT NULL DEFAULT 0,
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("idProducto")
);

-- CreateTable
CREATE TABLE "movimientos_inventario" (
    "idMovimiento" SERIAL NOT NULL,
    "idProducto" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "tipoMovimiento" "TipoMovimientoInventario" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "stockAnterior" INTEGER NOT NULL,
    "stockNuevo" INTEGER NOT NULL,
    "motivo" TEXT,
    "fechaMovimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_inventario_pkey" PRIMARY KEY ("idMovimiento")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "idProveedor" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("idProveedor")
);

-- CreateTable
CREATE TABLE "compras" (
    "idCompra" SERIAL NOT NULL,
    "idProveedor" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "fechaCompra" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoCompra" NOT NULL DEFAULT 'REGISTRADA',
    "observacion" TEXT,

    CONSTRAINT "compras_pkey" PRIMARY KEY ("idCompra")
);

-- CreateTable
CREATE TABLE "detalle_compras" (
    "idDetalleCompra" SERIAL NOT NULL,
    "idCompra" INTEGER NOT NULL,
    "idProducto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_compras_pkey" PRIMARY KEY ("idDetalleCompra")
);

-- CreateTable
CREATE TABLE "clientes" (
    "idCliente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "nitCi" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "tipoCliente" "TipoCliente" NOT NULL DEFAULT 'MINORISTA',
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("idCliente")
);

-- CreateTable
CREATE TABLE "ventas" (
    "idVenta" SERIAL NOT NULL,
    "idCliente" INTEGER,
    "idUsuario" INTEGER NOT NULL,
    "fechaVenta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "estado" "EstadoVenta" NOT NULL DEFAULT 'REGISTRADA',
    "observacion" TEXT,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("idVenta")
);

-- CreateTable
CREATE TABLE "detalle_ventas" (
    "idDetalleVenta" SERIAL NOT NULL,
    "idVenta" INTEGER NOT NULL,
    "idProducto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_ventas_pkey" PRIMARY KEY ("idDetalleVenta")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "idPedido" SERIAL NOT NULL,
    "idCliente" INTEGER,
    "idUsuarioRegistro" INTEGER,
    "origen" "OrigenPedido" NOT NULL,
    "fechaPedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE',
    "totalEstimado" DECIMAL(10,2),
    "observacion" TEXT,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("idPedido")
);

-- CreateTable
CREATE TABLE "detalle_pedidos" (
    "idDetallePedido" SERIAL NOT NULL,
    "idPedido" INTEGER NOT NULL,
    "idProducto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioEstimado" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_pedidos_pkey" PRIMARY KEY ("idDetallePedido")
);

-- CreateTable
CREATE TABLE "entregas" (
    "idEntrega" SERIAL NOT NULL,
    "idPedido" INTEGER NOT NULL,
    "idRepartidor" INTEGER,
    "fechaSalida" TIMESTAMP(3),
    "fechaEntrega" TIMESTAMP(3),
    "estado" "EstadoEntrega" NOT NULL DEFAULT 'PENDIENTE',
    "direccionEntrega" TEXT NOT NULL,
    "latitudEntrega" DECIMAL(10,7),
    "longitudEntrega" DECIMAL(10,7),
    "fotoEvidenciaUrl" TEXT,
    "observacion" TEXT,

    CONSTRAINT "entregas_pkey" PRIMARY KEY ("idEntrega")
);

-- CreateTable
CREATE TABLE "alertas" (
    "idAlerta" SERIAL NOT NULL,
    "idProducto" INTEGER,
    "tipoAlerta" "TipoAlerta" NOT NULL,
    "mensaje" TEXT NOT NULL,
    "estado" "EstadoAlerta" NOT NULL DEFAULT 'PENDIENTE',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaAtencion" TIMESTAMP(3),

    CONSTRAINT "alertas_pkey" PRIMARY KEY ("idAlerta")
);

-- CreateTable
CREATE TABLE "documentos" (
    "idDocumento" SERIAL NOT NULL,
    "idProducto" INTEGER,
    "idProveedor" INTEGER,
    "nombre" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL,
    "urlArchivo" TEXT NOT NULL,
    "fechaCarga" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVencimiento" TIMESTAMP(3),
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("idDocumento")
);

-- CreateTable
CREATE TABLE "registros_blockchain" (
    "idRegistro" SERIAL NOT NULL,
    "tipoDocumento" TEXT NOT NULL,
    "idReferencia" INTEGER NOT NULL,
    "hashDocumento" TEXT NOT NULL,
    "redBlockchain" TEXT,
    "txHash" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoBlockchain" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "registros_blockchain_pkey" PRIMARY KEY ("idRegistro")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_rol_idUsuario_idRol_key" ON "usuario_rol"("idUsuario", "idRol");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_nombre_key" ON "marcas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_medida_abreviatura_key" ON "unidades_medida"("abreviatura");

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigoBarras_key" ON "productos"("codigoBarras");

-- CreateIndex
CREATE UNIQUE INDEX "entregas_idPedido_key" ON "entregas"("idPedido");

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_idRol_fkey" FOREIGN KEY ("idRol") REFERENCES "roles"("idRol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ubicaciones_almacen" ADD CONSTRAINT "ubicaciones_almacen_idAlmacen_fkey" FOREIGN KEY ("idAlmacen") REFERENCES "almacenes"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "categorias"("idCategoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_idMarca_fkey" FOREIGN KEY ("idMarca") REFERENCES "marcas"("idMarca") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_idUnidad_fkey" FOREIGN KEY ("idUnidad") REFERENCES "unidades_medida"("idUnidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_idUbicacion_fkey" FOREIGN KEY ("idUbicacion") REFERENCES "ubicaciones_almacen"("idUbicacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "productos"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_idProveedor_fkey" FOREIGN KEY ("idProveedor") REFERENCES "proveedores"("idProveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_compras" ADD CONSTRAINT "detalle_compras_idCompra_fkey" FOREIGN KEY ("idCompra") REFERENCES "compras"("idCompra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_compras" ADD CONSTRAINT "detalle_compras_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "productos"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "clientes"("idCliente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_idVenta_fkey" FOREIGN KEY ("idVenta") REFERENCES "ventas"("idVenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "productos"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "clientes"("idCliente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_idUsuarioRegistro_fkey" FOREIGN KEY ("idUsuarioRegistro") REFERENCES "usuarios"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pedidos" ADD CONSTRAINT "detalle_pedidos_idPedido_fkey" FOREIGN KEY ("idPedido") REFERENCES "pedidos"("idPedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pedidos" ADD CONSTRAINT "detalle_pedidos_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "productos"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_idPedido_fkey" FOREIGN KEY ("idPedido") REFERENCES "pedidos"("idPedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_idRepartidor_fkey" FOREIGN KEY ("idRepartidor") REFERENCES "usuarios"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "productos"("idProducto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "productos"("idProducto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_idProveedor_fkey" FOREIGN KEY ("idProveedor") REFERENCES "proveedores"("idProveedor") ON DELETE SET NULL ON UPDATE CASCADE;
