namespace Dominio.Entidades.Inventario;

public class Producto
{
    public Guid Id { get; private set; }
    public string Codigo_Barras { get; private set; } = null!;
    public string Nombre { get; private set; } = null!;
    public decimal PrecioCompra { get; private set; }
    public decimal PrecioVenta { get; private set; }
    public string Descripcion { get; private set; } = string.Empty;
    public int Stock { get; private set; }
    public int StockMinimo { get; private set; }
    public bool Activo { get; private set; }
    public DateTime FechaCreacion { get; private set; }
    public Guid IdCategoria { get; private set; }
    public decimal Ganancia => PrecioVenta - PrecioCompra;

    private Producto(
        string codigoBarras,
        string nombre,
        decimal precioCompra,
        decimal precioVenta,
        string? descripcion,
        int stock,
        int stockMinimo,
        bool activo,
        DateTime fechaCreacion,
        Guid idCategoria
    )
    {
        if (string.IsNullOrWhiteSpace(codigoBarras))
        {
            throw new ArgumentException("El codigo de barras no puede estar vacio.", nameof(codigoBarras));
        }

        if (string.IsNullOrWhiteSpace(nombre))
        {
            throw new ArgumentException("El nombre no puede estar vacio.", nameof(nombre));
        }

        if (precioCompra <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(precioCompra), "El precio de compra debe ser mayor que cero.");
        }

        if (precioVenta <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(precioVenta), "El precio de venta debe ser mayor que cero.");
        }

        if (precioVenta < precioCompra)
        {
            throw new ArgumentException("El precio de venta no puede ser menor que el precio de compra.", nameof(precioVenta));
        }

        if (stock < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(stock), "El stock no puede ser negativo.");
        }

        if (stockMinimo < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(stockMinimo), "El stock minimo no puede ser negativo.");
        }

        if (idCategoria == Guid.Empty)
        {
            throw new ArgumentException("La categoria es obligatoria.", nameof(idCategoria));
        }

        Id = Guid.NewGuid();
        Codigo_Barras = codigoBarras.Trim();
        Nombre = nombre.Trim();
        PrecioCompra = precioCompra;
        PrecioVenta = precioVenta;
        Descripcion = descripcion?.Trim() ?? string.Empty;
        Stock = stock;
        StockMinimo = stockMinimo;
        Activo = activo;
        FechaCreacion = fechaCreacion == default ? DateTime.UtcNow : fechaCreacion;
        IdCategoria = idCategoria;
    }

    public static Producto Crear(
        string codigoBarras,
        string nombre,
        decimal precioCompra,
        decimal precioVenta,
        Guid idCategoria,
        string? descripcion = null,
        int stock = 0,
        int stockMinimo = 0,
        DateTime? fechaCreacion = null
    )
    {
        return new Producto(
            codigoBarras,
            nombre,
            precioCompra,
            precioVenta,
            descripcion,
            stock,
            stockMinimo,
            true,
            fechaCreacion ?? DateTime.UtcNow,
            idCategoria
        );
    }

    public void AumentarStock(int cantidad)
    {
        if (cantidad <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(cantidad), "La cantidad debe ser mayor que cero.");
        }

        Stock += cantidad;
    }

    public void DisminuirStock(int cantidad)
    {
        if (cantidad <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(cantidad), "La cantidad debe ser mayor que cero.");
        }

        if (Stock - cantidad < 0)
        {
            throw new InvalidOperationException("No hay stock suficiente para realizar la salida.");
        }

        Stock -= cantidad;
    }

    public void Activar()
    {
        Activo = true;
    }

    public void Desactivar()
    {
        Activo = false;
    }
}
