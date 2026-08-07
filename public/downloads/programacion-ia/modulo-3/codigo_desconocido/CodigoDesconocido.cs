using System;
using System.Collections.Generic;

public class Registro
{
    public string Id { get; set; } = "";
    public bool Activo { get; set; }
    public double Horas { get; set; }
    public double Tarifa { get; set; }
    public string Categoria { get; set; } = "";
    public bool Procesado { get; set; }
}

public class Resultado
{
    public int Procesados { get; }
    public double Total { get; }
    public double Promedio { get; }

    public Resultado(int procesados, double total, double promedio)
    {
        Procesados = procesados;
        Total = total;
        Promedio = promedio;
    }
}

public static class CodigoDesconocido
{
    public static Resultado Procesar(List<Registro> rs)
    {
        double t = 0;
        int n = 0;

        foreach (Registro r in rs)
        {
            if (!r.Activo)
            {
                continue;
            }
            if (r.Horas <= 0 || r.Tarifa < 0)
            {
                continue;
            }

            double x = r.Horas * r.Tarifa;

            if (r.Categoria == "urgente")
            {
                x += x * 0.25;
            }

            if (r.Horas >= 10)
            {
                x -= x * 0.10;
            }

            r.Procesado = true;
            t += x;
            n += 1;
        }

        double total = Math.Round(t, 2, MidpointRounding.AwayFromZero);
        double promedio = n == 0
            ? 0
            : Math.Round(t / n, 2, MidpointRounding.AwayFromZero);

        return new Resultado(n, total, promedio);
    }
}
