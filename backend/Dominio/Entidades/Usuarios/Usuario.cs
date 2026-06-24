namespace Dominio.Entidades.Usuarios;

public class Usuario
{
    public int Id { get; private set; }
    public string Nombre { get; private set; }
    public string Email { get; private set; }
    public string HashContrasena { get; private set; }
    public RolUsuario Rol { get; private set; }

    public Usuario(string nombre, string email, string hashContrasena, RolUsuario rol)
    {
        Nombre = nombre;
        Email = email;
        HashContrasena = hashContrasena;
        Rol = rol;
    }
}
