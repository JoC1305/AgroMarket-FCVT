namespace Dominio.Entidades.Clientes;

public class Cliente
{
    public Guid Id { get; private set; }

    public string Cedula { get; private set; } = null!;

    public string Nombre { get; private set; } = null!;

    public string Telefono { get; private set; } = string.Empty;

    public string Correo { get; private set; } = string.Empty;

    private Cliente(string cedula, string nombre, string? telefono, string? correo)
    {
        Id = Guid.NewGuid();
        Cedula = ValidarTextoObligatorio(cedula, nameof(cedula));
        Nombre = ValidarTextoObligatorio(nombre, nameof(nombre));
        Telefono = telefono?.Trim() ?? string.Empty;
        Correo = correo?.Trim() ?? string.Empty;
    }

    public static Cliente Crear(string cedula, string nombre, string? telefono = null, string? correo = null)
    {
        return new Cliente(cedula, nombre, telefono, correo);
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
