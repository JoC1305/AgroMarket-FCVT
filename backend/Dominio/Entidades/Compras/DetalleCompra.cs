namespace Dominio.Entidades.Compras;

public class DetalleCompra
{
    public Guid Id { get; private set; }

    public Guid CompraId { get; private set; }

    public Guid ProductoId { get; private set; }

    public int Cantidad { get; private set; }

    public decimal PrecioCompra { get; private set; }

    public decimal Subtotal => Cantidad * PrecioCompra;

    private DetalleCompra(Guid compraId, Guid productoId, int cantidad, decimal precioCompra)
    {
        if (compraId == Guid.Empty)
        {
            throw new ArgumentException("La compra es obligatoria.", nameof(compraId));
        }

        if (productoId == Guid.Empty)
        {
            throw new ArgumentException("El producto es obligatorio.", nameof(productoId));
        }

        if (cantidad <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(cantidad), "La cantidad debe ser mayor que cero.");
        }

        if (precioCompra <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(precioCompra), "El precio de compra debe ser mayor que cero.");
        }

        Id = Guid.NewGuid();
        CompraId = compraId;
        ProductoId = productoId;
        Cantidad = cantidad;
        PrecioCompra = precioCompra;
    }

    public static DetalleCompra Crear(Guid compraId, Guid productoId, int cantidad, decimal precioCompra)
    {
        return new DetalleCompra(compraId, productoId, cantidad, precioCompra);
    }
}
