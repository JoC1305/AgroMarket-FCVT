namespace Dominio.Entidades.Categoria;

public class Categoria
{
    public Guid Id { get; private set; }

    public string Nombre { get; private set; } = null!;

    public string Descripcion { get; private set; } = string.Empty;

    private Categoria(string nombre, string? descripcion)
    {
        Id = Guid.NewGuid();
        Nombre = ValidarTextoObligatorio(nombre, nameof(nombre));
        Descripcion = descripcion?.Trim() ?? string.Empty;
    }

    public static Categoria Crear(string nombre, string? descripcion = null)
    {
        return new Categoria(nombre, descripcion);
    }

    public void Actualizar(string nombre, string? descripcion = null)
    {
        Nombre = ValidarTextoObligatorio(nombre, nameof(nombre));
        Descripcion = descripcion?.Trim() ?? string.Empty;
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
