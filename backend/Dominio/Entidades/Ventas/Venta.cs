namespace Dominio.Entidades.Ventas;

public class Venta
{
    public Guid Id { get; private set; }

    public DateTime Fecha { get; private set; }

    public decimal Total { get; private set; }

    public bool? EsCredito { get; private set; }

    public MetodoPago MetodoPago { get; private set; }

    public Guid UsuarioId { get; private set; }

    public ICollection<DetalleVenta> Detalles { get; private set; } = new List<DetalleVenta>();

    private Venta(Guid usuarioId, MetodoPago metodoPago, bool? esCredito, DateTime fecha)
    {
        if (usuarioId == Guid.Empty)
        {
            throw new ArgumentException("El usuario es obligatorio.", nameof(usuarioId));
        }

        if (!Enum.IsDefined(typeof(MetodoPago), metodoPago))
        {
            throw new ArgumentException("El metodo de pago no es valido.", nameof(metodoPago));
        }

        if (metodoPago == MetodoPago.Credito && esCredito != true)
        {
            throw new ArgumentException("Una venta con metodo de pago credito debe marcarse como credito.", nameof(esCredito));
        }

        Id = Guid.NewGuid();
        Fecha = fecha == default ? DateTime.UtcNow : fecha;
        Total = 0;
        EsCredito = esCredito;
        MetodoPago = metodoPago;
        UsuarioId = usuarioId;
        Detalles = new List<DetalleVenta>();
    }

    public static Venta Crear(Guid usuarioId, MetodoPago metodoPago, bool? esCredito = null, DateTime? fecha = null)
    {
        return new Venta(usuarioId, metodoPago, esCredito, fecha ?? DateTime.UtcNow);
    }

    public void AgregarDetalle(Guid productoId, int cantidad, decimal precioUnitario)
    {
        var detalle = DetalleVenta.Crear(Id, productoId, cantidad, precioUnitario);
        Detalles.Add(detalle);
        Total += detalle.Subtotal;
    }
}
