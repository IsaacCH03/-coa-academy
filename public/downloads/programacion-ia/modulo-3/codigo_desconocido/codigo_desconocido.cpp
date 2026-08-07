#include <cmath>
#include <string>
#include <vector>

struct Registro {
    std::string id;
    bool activo;
    double horas;
    double tarifa;
    std::string categoria;
    bool procesado = false;
};

struct Resultado {
    int procesados;
    double total;
    double promedio;
};

double redondear(double valor) {
    return std::round(valor * 100.0) / 100.0;
}

Resultado procesar(std::vector<Registro>& rs) {
    double t = 0;
    int n = 0;

    for (Registro& r : rs) {
        if (!r.activo) {
            continue;
        }
        if (r.horas <= 0 || r.tarifa < 0) {
            continue;
        }

        double x = r.horas * r.tarifa;

        if (r.categoria == "urgente") {
            x += x * 0.25;
        }

        if (r.horas >= 10) {
            x -= x * 0.10;
        }

        r.procesado = true;
        t += x;
        n += 1;
    }

    return {
        n,
        redondear(t),
        n == 0 ? 0 : redondear(t / n)
    };
}

