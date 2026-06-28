namespace Dominio.Entidades.Contabilidad;

public class CuentaContable
{
    public Guid Id { get; private set; }

    public string Codigo { get; private set; } = null!;

    public string Nombre { get; private set; } = null!;

    public TipoCuenta Tipo { get; private set; }

    private CuentaContable(string codigo, string nombre, TipoCuenta tipo)
    {
        if (!Enum.IsDefined(typeof(TipoCuenta), tipo))
        {
            throw new ArgumentException("El tipo de cuenta no es valido.", nameof(tipo));
        }

        Id = Guid.NewGuid();
        Codigo = ValidarTextoObligatorio(codigo, nameof(codigo));
        Nombre = ValidarTextoObligatorio(nombre, nameof(nombre));
        Tipo = tipo;
    }

    public static CuentaContable Crear(string codigo, string nombre, TipoCuenta tipo)
    {
        return new CuentaContable(codigo, nombre, tipo);
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
