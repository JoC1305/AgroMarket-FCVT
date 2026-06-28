namespace Dominio.Entidades.Compras;

public class Pedido
{
    public Guid Id { get; private set; }
    public DateTime FechaCreacion { get; private set; }
    public DateTime FechaEsperada { get; private set; }
    public Guid ProveedorId { get; private set; }
    public EstadoPedido Estado { get; private set; }

    private Pedido(Guid proveedorId, DateTime fechaEsperada)
    {
        if (proveedorId == Guid.Empty)
        {
            throw new ArgumentException("El proveedor es obligatorio.", nameof(proveedorId));
        }

        if (fechaEsperada == default)
        {
            throw new ArgumentException("La fecha esperada es obligatoria.", nameof(fechaEsperada));
        }

        var fechaCreacion = DateTime.UtcNow;
        if (fechaEsperada < fechaCreacion.Date)
        {
            throw new ArgumentException("La fecha esperada no puede estar en el pasado.", nameof(fechaEsperada));
        }

        Id = Guid.NewGuid();
        ProveedorId = proveedorId;
        FechaCreacion = fechaCreacion;
        FechaEsperada = fechaEsperada;
        Estado = EstadoPedido.Pendiente;
    }

    public static Pedido Crear(Guid proveedorId, DateTime fechaEsperada)
    {
        return new Pedido(proveedorId, fechaEsperada);
    }

    public void MarcarComoEntregado()
    {
        Estado = EstadoPedido.Entregado;
    }

    public void MarcarComoAtrasado(DateTime fechaReferencia)
    {
        if (Estado == EstadoPedido.Entregado)
        {
            throw new InvalidOperationException("Un pedido entregado no puede marcarse como atrasado.");
        }

        if (fechaReferencia.Date <= FechaEsperada.Date)
        {
            throw new InvalidOperationException("El pedido aun no esta atrasado.");
        }

        Estado = EstadoPedido.Atrasado;
    }
}
