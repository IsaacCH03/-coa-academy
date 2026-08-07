import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

public class CodigoDesconocido {
    public static class Registro {
        public String id;
        public boolean activo;
        public double horas;
        public double tarifa;
        public String categoria;
        public boolean procesado;

        public Registro(String id, boolean activo, double horas, double tarifa, String categoria) {
            this.id = id;
            this.activo = activo;
            this.horas = horas;
            this.tarifa = tarifa;
            this.categoria = categoria;
        }
    }

    public static class Resultado {
        public int procesados;
        public double total;
        public double promedio;

        public Resultado(int procesados, double total, double promedio) {
            this.procesados = procesados;
            this.total = total;
            this.promedio = promedio;
        }
    }

    public static Resultado procesar(List<Registro> rs) {
        double t = 0;
        int n = 0;

        for (Registro r : rs) {
            if (!r.activo) {
                continue;
            }
            if (r.horas <= 0 || r.tarifa < 0) {
                continue;
            }

            double x = r.horas * r.tarifa;

            if ("urgente".equals(r.categoria)) {
                x += x * 0.25;
            }

            if (r.horas >= 10) {
                x -= x * 0.10;
            }

            r.procesado = true;
            t += x;
            n += 1;
        }

        double total = redondear(t);
        double promedio = n == 0 ? 0 : redondear(t / n);
        return new Resultado(n, total, promedio);
    }

    private static double redondear(double valor) {
        return BigDecimal.valueOf(valor).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}

