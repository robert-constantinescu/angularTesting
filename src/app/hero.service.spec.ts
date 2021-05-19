import {inject, TestBed} from '@angular/core/testing';
import {HeroService} from './hero.service';
import {MessageService} from './message.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('HeroService', () => {

  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let service;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add'])
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        {provide: MessageService, useValue: mockMessageService}
      ]

    });

    /**
     *    the TestBed.get()  is going to look inside the Dependency Injection registry and find the service the correlates with the given type
     *  in this case HttpTestingController.
     *    You can get a handle for other service also by calling:   TestBed.get(MessageService)
     */
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(HeroService);
  })


  describe('getHero', () =>{

    it('should call get with the correct URL',
      /**
       *  I'll let this here to serve as an example
       *
       *      - the inject() function is another way to get/inject services. A replacement for TestBed.get()
       *            - the first parameter of the inject() is a list of the dependencies type we want to get handle:  [HeroService, HttpTestingController]
       *            - the second parameter is a callback function that will then receive those types: (service: HeroService, controller: HttpTestingController) => {}
       *            - inside the callback function we write the tests?
       *
       *     TestBet.get() is cleaner, so that is used usually more.
       *
       *
       */
      inject([HeroService, HttpTestingController],
        (service: HeroService, controller: HttpTestingController) => {
          service.getHero(4).subscribe();

    }))

    it('should call get with the correct URL', () => {
      /**
       *      Explication about how this test is working:
       *   1. We are calling service.getHero(4).subscribe()  which internally makes a get call to   `api/hero/4'
       *   2. So we tell to 'httpTestingController'  that we are expecting one call to  `api/hero/4':  httpTestingController.expectOne('api/heroes/4');
       *  and this will create a request
       *   3. Then we tell the Mock HttpClient what data we want to return when this call comes in: request.flush({id:4, name: 'SuperDude', strength: 100})
       *  here we return an Object that is a Hero Object, that matches with the one that we expect
       *
       *
       *      !!!!!   IMPORTANT   !!!!!
       *   The service.getHero(4).subscribe() observable WILL NOT Receive any value UNTIL the  //3 & //4 will be executed.
       *   So the order of execution will be: 3, 4, 1
       *
       *   If you will comment 1, the test will fail because it's expecting to have EXACTLY ONE CALL to the 'api/heroes/4'.
       *   More than one call to 'api/heroes/4' will make the test fail.
       *
       *   The EXACTLY ONE CALL RULE to the api ('api/heroes') is enforced by the:  httpTestingController.verify();
       *   which verifies that there was EXACTLY ONE CALL made to the url('api/heroes')
       *
       *   So for example you can have another call to: 'api/heroes/3' and the test will still pass if you don't have the 'httpTestingController.verify();'
       *
       *
       */

      //1
      service.getHero(4).subscribe(
        () => {console.log('fulfilled')}
      );

      //2
      // service.getHero(3).subscribe(
      //   () => {console.log('fulfilled')}
      // );

      //3
      const request = httpTestingController.expectOne('api/heroes/4');

      //4
      request.flush({id:4, name: 'SuperDude', strength: 100})

      //5
      httpTestingController.verify();



    })


  })

})
