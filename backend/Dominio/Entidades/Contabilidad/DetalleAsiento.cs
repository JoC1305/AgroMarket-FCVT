namespace Dominio.Entidades.Contabilidad;

public class DetalleAsiento
{
    public Guid Id { get; private set; }

    public Guid AsientoContableId { get; private set; }

    public Guid CuentaContableId { get; private set; }

    public decimal Debe { get; private set; }

    public decimal Haber { get; private set; }
    
    private DetalleAsiento(Guid asientoContableId, Guid cuentaContableId, decimal debe, decimal haber)
    {
        if (asientoContableId == Guid.Empty)
        {
            throw new ArgumentException("El asiento contable es obligatorio.", nameof(asientoContableId));
        }

        if (cuentaContableId == Guid.Empty)
        {
            throw new ArgumentException("La cuenta contable es obligatoria.", nameof(cuentaContableId));
        }

        if (debe < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(debe), "El debe no puede ser negativo.");
        }

        if (haber < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(haber), "El haber no puede ser negativo.");
        }

        if (debe == 0 && haber == 0)
        {
            throw new ArgumentException("El detalle debe tener un valor en debe o haber.");
        }

        if (debe > 0 && haber > 0)
        {
            throw new ArgumentException("El detalle no puede tener debe y haber al mismo tiempo.");
        }

        Id = Guid.NewGuid();
        AsientoContableId = asientoContableId;
        CuentaContableId = cuentaContableId;
        Debe = debe;
        Haber = haber;
    }

    public static DetalleAsiento Crear(Guid asientoContableId, Guid cuentaContableId, decimal debe, decimal haber)
    {
        return new DetalleAsiento(asientoContableId, cuentaContableId, debe, haber);
    }
}
