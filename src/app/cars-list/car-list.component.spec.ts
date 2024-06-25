import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarListComponent } from './car-list.component';

describe('CarListComponent', () => {
  let component: CarListComponent;
  let fixture: ComponentFixture<CarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarListComponent], // Add the component to the declarations
    }).compileComponents();

    fixture = TestBed.createComponent(CarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display cars in the table', () => {
    // Arrange: Set up test data (e.g., mock cars)
    const mockCars = [
      { id: 1, make: 'Toyota', model: 'Camry', numberplate: 'ABC123' },
      // Add more mock cars as needed
    ];
    component.cars = mockCars;

    // Act: Trigger change detection
    fixture.detectChanges();

    // Assert: Verify that the cars are displayed in the table
    const tableRows = fixture.nativeElement.querySelectorAll('mat-row');
    expect(tableRows.length).toBe(mockCars.length);
  });

  it('should filter cars based on search input', () => {
    // Arrange: Set up test data (e.g., mock cars)
    const mockCars = [
      { id: 1, make: 'Toyota', model: 'Camry', numberplate: 'ABC123' },
      { id: 2, make: 'Honda', model: 'Civic', numberplate: 'XYZ789' },
      // Add more mock cars as needed
    ];
    component.cars = mockCars;

    // Act: Set a filter value (e.g., search for 'Toyota')
    component.filterControl.setValue('Toyota');
    fixture.detectChanges();

    // Assert: Verify that only Toyota cars are displayed
    const tableRows = fixture.nativeElement.querySelectorAll('mat-row');
    expect(tableRows.length).toBe(1); // Only one Toyota car
  });
});
