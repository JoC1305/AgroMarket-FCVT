namespace Dominio.Entidades.Ventas;

public class DetalleVenta
{
    public Guid Id { get; private set; }

    public Guid VentaId { get; private set; }

    public Guid ProductoId { get; private set; }

    public int Cantidad { get; private set; }

    public decimal PrecioUnitario { get; private set; }

    public decimal Subtotal => Cantidad * PrecioUnitario;

    private DetalleVenta(Guid ventaId, Guid productoId, int cantidad, decimal precioUnitario)
    {
        if (ventaId == Guid.Empty)
        {
            throw new ArgumentException("La venta es obligatoria.", nameof(ventaId));
        }

        if (productoId == Guid.Empty)
        {
            throw new ArgumentException("El producto es obligatorio.", nameof(productoId));
        }

        if (cantidad <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(cantidad), "La cantidad debe ser mayor que cero.");
        }

        if (precioUnitario <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(precioUnitario), "El precio unitario debe ser mayor que cero.");
        }

        Id = Guid.NewGuid();
        VentaId = ventaId;
        ProductoId = productoId;
        Cantidad = cantidad;
        PrecioUnitario = precioUnitario;
    }

    public static DetalleVenta Crear(Guid ventaId, Guid productoId, int cantidad, decimal precioUnitario)
    {
        return new DetalleVenta(ventaId, productoId, cantidad, precioUnitario);
    }
}
