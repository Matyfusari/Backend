class Usuario {
    constructor(nombre, apellidos,libros, mascotas){
        this.nombre=nombre;
        this.apellidos=apellidos;
        this.libros= libros;
        this.mascotas= mascotas;
        
    }     
    getFullName(){
        return `${this.nombre} ${this.apellidos}`
    }
    addBook(nombreLibro, nombreAutor) {
        this.libros.push({nombre: nombreLibro, autor: nombreAutor})
    }
    getBookNames(){
        return this.libros.map(nombreLibro => nombreLibro.nombre)
    }
    addMascotas(mascota){
       this.mascotas.push(mascota);
    }
    countMascota(){
        return this.mascotas.length
    }
    }
    
    let usuario1 = new Usuario('Matias','Fusari' ,[{nombre: 'El señor de las moscas',autor: 'William Golding'}, {nombre: 'Fundacion', autor: 'Isaac Asimov'}], ['perro', 'gato'])
    
   //usuario1.addMascotas("serpiente")
    console.log(usuario1.countMascota())