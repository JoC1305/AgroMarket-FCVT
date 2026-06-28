namespace Dominio.Entidades.Proveedores;

public class Proveedor
{
    public Guid Id { get; private set; }

    public string Nombre { get; private set; } = null!;

    public string Telefono { get; private set; } = string.Empty;

    public string Correo { get; private set; } = string.Empty;

    private Proveedor(string nombre, string? telefono, string? correo)
    {
        Id = Guid.NewGuid();
        Nombre = ValidarTextoObligatorio(nombre, nameof(nombre));
        Telefono = telefono?.Trim() ?? string.Empty;
        Correo = correo?.Trim() ?? string.Empty;
    }

    public static Proveedor Crear(string nombre, string? telefono = null, string? correo = null)
    {
        return new Proveedor(nombre, telefono, correo);
    }

    public void ActualizarContacto(string? telefono, string? correo)
    {
        Telefono = telefono?.Trim() ?? string.Empty;
        Correo = correo?.Trim() ?? string.Empty;
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
