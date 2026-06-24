namespace Dominio.Entidades.Inventario;

public class Producto
{
    public Guid Id { get; private set; }
    public string Codigo_Barras { get; private set; }
    public string Nombre { get; private set; }
    public decimal PrecioCompra { get; private set; }
    public decimal PrecioVenta { get; private set; }
    public string Descripcion { get; private set; }
    public int Stock { get; private set; }
    public int StockMinimo { get; private set; }
    public bool Activo { get; private set; }
    public DateTime FechaCreacion { get; private set; }
    public Guid IdCategoria { get; private set; }
    public decimal Ganancia => PrecioVenta - PrecioCompra;

    public Producto(
        string codigo_Barras,
        string nombre,
        decimal precioCompra,
        decimal precioVenta,
        string descripcion,
        int stock,
        int stockMinimo,
        bool activo,
        DateTime fechaCreacion,
        Guid idCategoria
    )
        {
            Id = Guid.NewGuid();
            Codigo_Barras = codigo_Barras;
            Nombre = nombre;
            PrecioCompra = precioCompra;
            PrecioVenta = precioVenta;
            Descripcion = descripcion;
            Stock = stock;
            StockMinimo = stockMinimo;
            Activo = activo;
            FechaCreacion = fechaCreacion;
            IdCategoria = idCategoria;
        }
    }