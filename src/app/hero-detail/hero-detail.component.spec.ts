import {async, ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';
import {HeroDetailComponent} from './hero-detail.component';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {HeroService} from '../hero.service';
import {of} from 'rxjs';
import {FormsModule} from '@angular/forms';

describe('HeroDetailComponent', () => {

  let mockActivatedRoute, mockHeroService, mockLocation;
  let fixture: ComponentFixture<HeroDetailComponent>


  beforeEach(() => {
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);

    /**
     * Dealing with ActivatedRoute object
     */
    mockActivatedRoute = {
      snapshot: {paramMap: { get: () => { return '3'; }}}
    };

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: HeroService, useValue: mockHeroService},
        {provide: Location, useValue: mockLocation},
      ]
    });

    fixture = TestBed.createComponent(HeroDetailComponent);
    mockHeroService.getHero.and.returnValue(of({id:3, name: 'Richie', strength: 11111}))

  });

  it('should render hero name in a h2 tag', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('RICHIE');

  })

  it('should call updateHero when save is called - DEALING WITH ASYNCHRONOUS CODE',
    /**the fakeAsync work by wrapping the callback function for the test
     * the fakeAsync function return another function that is passed to the test.
     *
     * Now we can treat all of the ASYNCHRONOUS code AS being SYNCHRONOUS
     */
    fakeAsync(() => {
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();
        /**
         *
         *   - when the save() method is called is making us wait for 250ms(with debounce() function) before we call updateHero()
         *   - We can actually tell the test to FAST FORWARD an AMOUNT OF TIME(e.g 250ms) in between the call to save() and expect() methods
         *   - And we do this by using the:
         *              @tick()  function
         *
         *    e.g:  tick(300ms) => fast forward 300ms and call any code that should be called inside the timeframe
         *
         *    This is called in some special ZONE, that allows us to control the clock inside of that zone:   the  ZONE.JS   (google if you need more info)
         *
         *    if you don't know EXACTLY how MUCH TIME you need to wait, there is ANOTHER FUNCTION for this:
         *    @flush()    => basically says to look at the zone and if there's any tasks that are waiting and if they are, fast forward until the tasks are executed
         */
        tick(250);
        // flush();
        expect(mockHeroService.updateHero).toHaveBeenCalled();
    }
    )
  );

  /**
   * the 'done' parameter passed to the callback function, would tell JASMINE that this is an ASYNCHRONOUS TEST and it WILL WAIT until
   * the DONE function is CALLED before it finishes the test
   *
   * This approach is not used that OFTEN because it makes the OTHER TESTS wait for 300ms.
   *
   *  it('should call updateHero when save is called', (done) => {
   *   mockHeroService.updateHero.and.returnValue(of({}));
   *   fixture.detectChanges();
   *
   *   fixture.componentInstance.save();
   *
   *   setTimeout(() => {
   *     expect(mockHeroService.updateHero).toHaveBeenCalled();
   *     //done() called after expect makes the TEST TO WAIT until this ASYNCHRONOUS CODE is done
   *     done();
   *   }, 300);
   *  })
   */


  it('should call updateHero when save is called with - DEALING WITH PROMISES',
    /**
     * @async() function is handling PROMISES very well but it DOES NOT DO WELL with TIMEOUTS
     * @fakeAsync  works well BOTH WITH PROMISES and TIMEOUTS
     */
    async(() => {
      mockHeroService.updateHero.and.returnValue(of({}));
      fixture.detectChanges();

      fixture.componentInstance.save();
      /**
       * A COMPONENT is considered STABLE when ALL PROMISES from the COMPONENT have BEEN RESOLVED
       * So basically    @whenStable()  is SAYING TO WAIT FOR ALL PROMISES TO BE RESOLVED
       *
       * so the code from the   @then()  callback, WILL BE CALLED AFTER ALL PROMISES HAVE BEEN RESOLVED
       *
       * This is relying same as the tick() on ZONE JS
       *
       *
       */
      fixture.whenStable().then(() => {
        expect(mockHeroService.updateHero).toHaveBeenCalled();
      });
    })
  );

})
