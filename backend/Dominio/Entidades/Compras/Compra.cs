namespace Dominio.Entidades.Compras;

public class Compra
{
    public Guid Id { get; private set; }
    public Guid ProveedorId { get; private set; }
    public Guid PedidoId { get; private set; }
    public DateTime Fecha { get; private set; }
    public decimal Total { get; private set; }

    private Compra(Guid proveedorId, Guid pedidoId, DateTime fecha, decimal total)
    {
        if (proveedorId == Guid.Empty)
        {
            throw new ArgumentException("El proveedor es obligatorio.", nameof(proveedorId));
        }

        if (pedidoId == Guid.Empty)
        {
            throw new ArgumentException("El pedido es obligatorio.", nameof(pedidoId));
        }

        if (total < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(total), "El total no puede ser negativo.");
        }

        Id = Guid.NewGuid();
        ProveedorId = proveedorId;
        PedidoId = pedidoId;
        Fecha = fecha == default ? DateTime.UtcNow : fecha;
        Total = total;
    }

    public static Compra Crear(Guid proveedorId, Guid pedidoId, decimal total, DateTime? fecha = null)
    {
        return new Compra(proveedorId, pedidoId, fecha ?? DateTime.UtcNow, total);
    }
}
