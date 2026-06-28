namespace Dominio.Entidades.Contabilidad;

public class AsientoContable
{
    public Guid Id { get; private set; }

    public DateTime Fecha { get; private set; }

    public string Descripcion { get; private set; } = null!;

    public ICollection<DetalleAsiento> Detalles { get; private set; } = new List<DetalleAsiento>();

    private AsientoContable(DateTime fecha, string descripcion)
    {
        Id = Guid.NewGuid();
        Fecha = fecha == default ? DateTime.UtcNow : fecha;
        Descripcion = ValidarTextoObligatorio(descripcion, nameof(descripcion));
        Detalles = new List<DetalleAsiento>();
    }

    public static AsientoContable Crear(string descripcion, DateTime? fecha = null)
    {
        return new AsientoContable(fecha ?? DateTime.UtcNow, descripcion);
    }

    public void AgregarDetalle(Guid cuentaContableId, decimal debe, decimal haber)
    {
        Detalles.Add(DetalleAsiento.Crear(Id, cuentaContableId, debe, haber));
    }

    private static string ValidarTextoObligatorio(string valor, string parametro)
    {
        if (string.IsNullOrWhiteSpace(valor))
        {
            throw new ArgumentException("El valor no puede estar vacio.", parametro);
        }

        return valor.Trim();
    }
}
