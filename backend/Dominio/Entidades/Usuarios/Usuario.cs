namespace Dominio.Entidades.Usuarios;

public class Usuario
{
    public Guid Id { get; private set; }
    public string Nombre { get; private set; } = null!;
    public string Email { get; private set; } = null!;
    public string HashContrasena { get; private set; } = null!;
    public RolUsuario Rol { get; private set; }

    private Usuario(string nombre, string email, string hashContrasena, RolUsuario rol)
    {
        if (string.IsNullOrWhiteSpace(nombre))
        {
            throw new ArgumentException("El nombre no puede estar vacio.", nameof(nombre));
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("El email no puede estar vacio.", nameof(email));
        }

        if (string.IsNullOrWhiteSpace(hashContrasena))
        {
            throw new ArgumentException("La contrasena no puede estar vacia.", nameof(hashContrasena));
        }

        if (!Enum.IsDefined(typeof(RolUsuario), rol))
        {
            throw new ArgumentException("El rol proporcionado no es valido.", nameof(rol));
        }

        Id = Guid.NewGuid();
        Nombre = nombre.Trim();
        Email = email.Trim().ToLowerInvariant();
        HashContrasena = hashContrasena;
        Rol = rol;
    }

    public static Usuario Crear(string nombre, string email, string hashContrasena, RolUsuario rol)
    {
        return new Usuario(nombre, email, hashContrasena, rol);
    }

    public void CambiarRol(RolUsuario rol)
    {
        if (!Enum.IsDefined(typeof(RolUsuario), rol))
        {
            throw new ArgumentException("El rol proporcionado no es valido.", nameof(rol));
        }

        Rol = rol;
    }

    public void CambiarContrasena(string hashContrasena)
    {
        if (string.IsNullOrWhiteSpace(hashContrasena))
        {
            throw new ArgumentException("La contrasena no puede estar vacia.", nameof(hashContrasena));
        }

        HashContrasena = hashContrasena;
    }
}
