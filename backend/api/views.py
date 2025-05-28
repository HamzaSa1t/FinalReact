from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomerRelationToProduct, Customer
from .serializers import CustomerRelationToProductSerializer
from decimal import Decimal  
from django.contrib.auth.models import User
from rest_framework import generics, response, status
from rest_framework.response import Response
from django.http import Http404
from django.core.validators import validate_email
from .serializers import UserSerializer, ProductSerializer, Customerserializers, Employeeserializers,UpdateAmountSerializer, Managerserializers, CommentSerializer, CustomerRelationToProductSerializer, ManagerRelationToProductSerializer, EmployeeRelationToProductSerializer, RatingProductSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Product, Customer, Employee, Manager, CustomerRelationToProduct, Profile, Comment, ManagerRelationToProduct, EmployeeRelationToProduct
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from django.db import transaction
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import NotFound
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status
from django.db.models import Sum, F, Count
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated  
from .models import CustomerRelationToProduct, Product, Customer
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.generics import UpdateAPIView
from .models import Product, Customer, CustomerRelationToProduct
from .serializers import Customerserializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
import logging
from django.db import IntegrityError
from decimal import Decimal, ROUND_HALF_UP
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
logger = logging.getLogger(__name__)
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


""" @app.route('/refresh_token', methods=['POST'])
def TokenRefreshSlidingView():
    refresh_token = request.json.get('refresh_token')
    if not refresh_token:
        return jsonify({'message': 'Refresh token is missing!'}), 401
    try:
        data = jwt.decode(refresh_token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user = User.query.filter_by(id=data['id']).first()
        if not user:
            return jsonify({'message': 'Invalid refresh token!'}), 401
        access_token = jwt.encode({'id': str(user.id), 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'access_token': access_token})
    except:
        return jsonify({'message': 'Invalid refresh token!'}), 401 """

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_email_api(request):

    try:
        if not isinstance(request.data, dict):
            return Response({'error': 'Invalid request data format. Expected a dictionary.'}, status=400)

        data = request.data
        email = data.get('email')

        if not email:
            return Response({'error': 'Email address is required'}, status=400)

        validate_email(email)

        subject = 'Email subject for Amazoo'
        message = 'This is a trial message.'
        from_email = '37mezo@gmail.com'
        recipient_list = [email]

        send_mail(subject, message, from_email, recipient_list)

        return Response({'message': 'Email sent successfully'})

    except ValidationError:
        return Response({'error': 'Invalid email address'}, status=400)
    except Exception as e:
        return Response({'error': f'Error sending email: {str(e)}'}, status=500)

class IsManagerOrEmployee(BasePermission):
    def has_permission(self, request, view):
                return request.user.is_authenticated and (request.user.profile_user.user_type in ['Manager', 'Employee'])

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class IsManager(BasePermission):
    def has_permission(self, request, view):
                return request.user.is_authenticated and (request.user.profile_user.user_type == 'Manager') 
class IsEmployee(BasePermission):
    def has_permission(self, request, view):
                return request.user.is_authenticated and (request.user.profile_user.user_type == 'Employee') 
class IsManagerOrSeller(BasePermission):
    def has_permission(self, request, view): # pk?
                product = Product.objects.get(pk = view.kwargs["pk"])      
                return request.user.is_authenticated and ( (request.user.profile_user.user_type == 'Manager') or request.user.username == product.seller.username  ) 
class IsCustomer(BasePermission):
    def has_permission(self, request, view):
                return request.user.is_authenticated and (request.user.profile_user.user_type == "Customer")


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    @transaction.atomic
    def perform_create(self, serializer):
        user = None
        try:
            user = serializer.save() 
            profile = user.profile_user  

            if not profile:
                user.delete()
                raise ValidationError({"profile_user": "Profile creation failed"})

            user_type = profile.user_type
            if not user_type:
                user.delete()
                raise ValidationError({"profile_user": {"user_type": "This field is required"}})


            valid_types = {"Customer", "Employee", "Manager"}
            if user_type not in valid_types:
                user.delete()
                raise ValidationError({"profile_user": {"user_type": "Invalid user type"}})
    
            if user_type == "Customer":
                Customer.objects.create(user=user)
            elif user_type == "Employee":
                Employee.objects.create(user=user)
            elif user_type == "Manager":
                Manager.objects.create(user=user)
        
        except IntegrityError as e:
            if user:
                user.delete()
            raise ValidationError({"error": "Database error: " + str(e)})
        except Exception as e:
            if user:
                user.delete()
            raise ValidationError({"error": "An error occurred: " + str(e)})


class ShowBalance(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is logged in

    def get(self, request, *args, **kwargs):
        user = request.user # we use it in apiviews

        try:
            customer = user.customer_username  # Access the related Customer object
            return Response({"balance": customer.amount}, status=status.HTTP_200_OK)
        except Customer.DoesNotExist:
            pass  

        try:
            employee = user.employee_username  # Access the related Employee object
            return Response({"balance": employee.amount}, status=status.HTTP_200_OK)
        except Employee.DoesNotExist:
            pass  

        try:
            manager = user.manager_username  # Access the related Manager object
            return Response({"balance": manager.amount}, status=status.HTTP_200_OK)
        except Manager.DoesNotExist:
            pass  
                    
        return Response({"error": "no user found."}, status=status.HTTP_404_NOT_FOUND)


class UpdateCustomerAmountView(APIView):

    permission_classes = [IsCustomer]  

    def post(self, request):
        user = self.request.user
        try: #?
            customer = Customer.objects.get(user=user)
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateAmountSerializer(data=request.data)
        if serializer.is_valid():
            increament = serializer.validated_data["increament"]
            customer.amount += increament
            customer.save()

            return Response(
                {"message": "Customer amount updated successfully.", "new_amount": customer.amount},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class ShowHistoryCustomer(generics.ListAPIView):
    serializer_class = CustomerRelationToProductSerializer  
    permission_classes  = [IsCustomer]
    
    def get_queryset(self):
        user = self.request.user
        our_products = CustomerRelationToProduct.objects.filter(customer__user = user, is_bought = True ) 
        return  our_products


class ListCustomers(generics.ListAPIView):
    queryset = Customer.objects.all()
    serializer_class = Customerserializers
    permission_classes = [IsManagerOrEmployee]
class InsufficientBalanceError(Exception):
    def __init__(self, message="Your balance is not enough"):
        self.message = message
        super().__init__(self.message)
    
class CalculateCharge(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
            user = request.user
            customer = user.customer_username 
            
            our_products = CustomerRelationToProduct.objects.filter( customer = customer, is_bought = False )
            customer.charge = 0

            if customer.charge is None:
                customer.charge = 0

            for i in our_products:
                customer.charge += Decimal(i.product.price) * i.quantity

            customer.save()                
            return Response({"charge": customer.charge}, status=status.HTTP_200_OK)

class Buy(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, pk, *args, **kwargs):
        try:    
                user = User.objects.get(pk=pk)
                our_customer = Customer.objects.get(user=user)
                our_products = CustomerRelationToProduct.objects.filter(customer = our_customer, is_bought = False )

            # CHARGE
                our_customer.charge = 0 
                if our_customer.charge is None:
                    our_customer.charge = 0
                else:
                    for i in our_products:
                        our_customer.charge += Decimal(i.product.price) * i.quantity
                charge = our_customer.charge


                if our_customer.amount < charge:
                    raise InsufficientBalanceError()

                email = request.data.get("email")  
                if email:
                        send_email(email)  

                # NO USE
                for i in our_products:   
                    our_customer.quantity_bought += i.quantity 

                for x in our_products:
                    x.product.quantity_sold += x.quantity
                    x.product.save()   
                
          

                # CUSTOMER
                our_customer.how_much_bought += charge      
                our_customer.amount -= charge
                our_customer.charge = 0
                our_customer.save()  

                product_list = [relation.product for relation in our_products]
                our_customer.history.add(*product_list)
                
                for i in our_products:                                                          

                    our_seller = i.product.seller
                    
                    if our_seller.profile_user.user_type == "Employee":
                        our_seller.employee_username.amount += i.quantity * i.product.price  
                        our_seller.employee_username.history.add(i.product)  # #######
                        our_seller.employee_username.save()
                    
                    elif our_seller.profile_user.user_type == "Manager":
                        our_seller.manager_username.amount += i.quantity * i.product.price  
                        our_seller.manager_username.history.add(i.product)  ###########
                        our_seller.manager_username.save()


                for i in our_products:
                    if i.product.seller.profile_user.user_type == "Employee":
                        EmployeeRelationToProduct.objects.create(seller=i.product.seller.employee_username, product=i.product,quantity=i.quantity)
                        print(i.product.seller.employee_username)
                    elif i.product.seller.profile_user.user_type == "Manager":
                        print(i.product.seller.manager_username)
                        ManagerRelationToProduct.objects.create(seller=i.product.seller.manager_username, product=i.product,quantity=i.quantity)






                for x in our_products: 
                    x.is_bought = True    
                    x.save()  

                return Response({"message": "Purchase successful"}, status=status.HTTP_200_OK)


        except Customer.DoesNotExist:
                return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
        except InsufficientBalanceError as e:
                return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)  
        except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)  

class CreateComment(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        pk = self.kwargs.get("pk")  
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:  
            raise NotFound(detail="Product with the given ID does not exist.")

        user = self.request.user
        try:
            customer = Customer.objects.get(user=user)
        except Customer.DoesNotExist:
            raise NotFound(detail="Customer profile not found.")

        serializer.save(written_by=customer, the_product=product)
class SessionLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"detail": "Please provide both username and password."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)  
            return Response({"detail": "Session login successful"})
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"detail": "Please provide both username and password."}, status=status.HTTP_400_BAD_REQUEST)

        
        user = authenticate(request, username=username, password=password)     #  If the authentication is successful (i.e., the username and password are correct), it returns the User object. If authentication fails (incorrect username or password), it returns None.
        
        if user is not None:
            # Create JWT token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({
                'access': access_token,
                'refresh': str(refresh)
            })
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class AddToChart(UpdateAPIView):
    queryset = Customer.objects.all()
    serializer_class = Customerserializers
    permission_classes = [IsCustomer]

    def get_object(self):
        try:
            return self.request.user.customer_username
        except Customer.DoesNotExist:
            raise NotFound("Customer profile not found.")

    def perform_update(self, serializer):
        customer = self.get_object()
        product_id = self.request.data.get('Product_id')
        quantity = self.request.data.get('quantity', 1)  

        if not product_id:
            raise ValidationError({"Product_id": "This field is required."})
        
        if quantity <= 0:
            raise ValidationError({"quantity": "Quantity must be greater than 0."})

        try:
            
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise ValidationError({"Product_id": "Product not found."})

        relation, created = CustomerRelationToProduct.objects.get_or_create(customer=customer, product=product, is_bought=False)
        
        if not created:  
            relation.quantity += quantity
            relation.save()
        else:
            relation.quantity = quantity
            relation.save()

        return Response({"detail": f"Added {quantity} {product.name}(s) to your basket."}, status=status.HTTP_200_OK)

class ClearChart(generics.DestroyAPIView): 
    serializer_class = CustomerRelationToProductSerializer
    permission_classes = [IsCustomer]
    def delete(self, request, *args, **kwargs):
        user = self.request.user
        customer = Customer.objects.get(user=user)
        my_products = CustomerRelationToProduct.objects.filter(customer=customer, is_bought=False)

        for i in my_products:
            i.delete()
            

        
        return response.Response({"detail": "Basket cleared."}, status=status.HTTP_200_OK)

class DeleteFromChart(generics.DestroyAPIView):
    serializer_class = CustomerRelationToProductSerializer
    permission_classes = [IsCustomer]

    def get_object(self):
        user = self.request.user
        relation_id = self.kwargs.get('pk') 
        
        logger.info(f"Attempting to delete relation with ID: {relation_id} for user: {user.username}")
        
        try:
            customer = Customer.objects.get(user=user)

            all_relations = CustomerRelationToProduct.objects.filter(customer=customer, is_bought=False)
            logger.info(f"Current basket items for user {user.username}: {[f'Relation ID: {r.id}, Product ID: {r.product.id}' for r in all_relations]}")
            
            relation = CustomerRelationToProduct.objects.get(
                id=relation_id,
                customer=customer,
                is_bought=False
            )
            logger.info(f"Found relation to delete: Relation ID {relation.id}, Product ID {relation.product.id}")
            return relation
            
        except CustomerRelationToProduct.DoesNotExist:
            logger.error(f"Relation with ID: {relation_id} not found in the basket for user: {user.username}")
            raise NotFound("The product is not in your basket.")
    
    def perform_destroy(self, instance):
        instance.delete()
        logger.info(f"Product with ID: {instance.product.id} deleted from the basket for user: {instance.customer.user.username}")

class ShowChart(generics.ListAPIView):
    permission_classes = [IsCustomer]
    serializer_class = CustomerRelationToProductSerializer

    def get_queryset(self):
        user = self.request.user

        try:
            customer = Customer.objects.get(user=user)
            return CustomerRelationToProduct.objects.filter(customer=customer, is_bought = False)
        except Customer.DoesNotExist:
            raise NotFound("Customer not found.")

class UpdateChart(generics.UpdateAPIView):
    serializer_class = CustomerRelationToProductSerializer
    permission_classes = [IsCustomer]  

    def get_queryset(self):
        """Allow users to update only their own cart items"""
        user = self.request.user
        customer = Customer.objects.get(user=user)
        return CustomerRelationToProduct.objects.filter(customer=customer, is_bought=False)

    def update(self, request, *args, **kwargs):
        user = self.request.user
        customer = Customer.objects.get(user=user)

        cart_item = self.get_object()
        if cart_item.customer != customer:
            return Response({"error": "You are not allowed to modify this item."}, status=status.HTTP_403_FORBIDDEN)

        # Allow only quantity updates
        allowed_fields = {"quantity"}
        if any(field not in allowed_fields for field in request.data):
            return Response({"error": "Only quantity can be updated."}, status=status.HTTP_400_BAD_REQUEST)

        return super().update(request, *args, **kwargs)






# product

class MyProductList(generics.ListAPIView):
    permission_classes = [IsManagerOrEmployee]
    serializer_class = ProductSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Product.objects.filter(seller = user)
        raise NotFound("you are not authenticated")

class DeleteProduct(generics.DestroyAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    permission_classes = [IsManagerOrSeller]

    def perform_destroy(self, instance):

        logger.info(f"Deleting product: {instance.name} (ID: {instance.pk})")
        super().perform_destroy(instance)

class UpdateProduct(generics.RetrieveUpdateAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
   
    def perform_update(self, serializer):
        serializer.save()
        print(f"Product {Product.name} updated successfully")  

class RateProduct(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    http_method_names = ['patch']
    lookup_field = 'pk'

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if 'new_rating' in request.data:
            new_rating = Decimal(request.data['new_rating'])
        
            current_avg = Decimal(instance.rating if instance.rating is not None else 0)
            current_count = Decimal(instance.number_of_ratings)
        
            new_average = (current_avg * current_count + new_rating) / (current_count + 1)
            new_average = new_average.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
            request.data['rating'] = new_average
        
            request.data['number_of_ratings'] = current_count + 1

            if serializer.is_valid():
                self.perform_update(serializer)
                return response.Response(serializer.data, status=status.HTTP_200_OK)
            else:
                rating_errors = serializer.errors.get('new_rating')
                if rating_errors:
                    return response.Response({'new_rating': rating_errors}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return response.Response({'error': 'Rating field is required'}, status=status.HTTP_400_BAD_REQUEST)


    def perform_update(self, serializer):
        serializer.save()  

class ListProducts(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]


class CreateProduct(generics.CreateAPIView):
    permission_classes = [IsManagerOrEmployee]
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(seller = self.request.user)
        else:
            print(serializer.errors)


class ShowProductDetails(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    queryset = Product.objects.all()
    lookup_field = "pk" 

class GetComments(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        pk = self.kwargs.get("pk")  
        
        try:
            our_product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise NotFound(detail="Product with the given ID does not exist.")

        return Comment.objects.filter(the_product=our_product)



class ListManagers(generics.ListAPIView):
    queryset = Manager.objects.all()
    serializer_class = Managerserializers
    permission_classes = [IsManager] 

class ShowHistoryManager(generics.ListAPIView):
    serializer_class = ManagerRelationToProductSerializer  
    permission_classes  = [AllowAny]
    
    def get_queryset(self):
        user = self.request.user
        if user.profile_user.user_type == "Employee":
            our_products = EmployeeRelationToProduct.objects.filter(seller = user.employee_username)
        elif user.profile_user.user_type == "Manager":
            our_products = ManagerRelationToProduct.objects.filter(seller = user.manager_username)  
        else:
            raise NotFound("You are not a manager or employee.")    
        return  our_products


""" class ShowHistoryEmployee(generics.ListAPIView):
    serializer_class = EmployeeRelationToProductSerializer  
    permission_classes  = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        our_products = EmployeeRelationToProduct.objects.filter(seller__user = user)
        return  our_products   """



"""    
class Dashboard(APIView):
    permission_classes = [IsManager]

    def get(self, request, *args, **kwargs):
        
        # total info:
        total_amount = 0
        ovrall_quantity = 0
        our_products = CustomerRelationToProduct.objects.filter(is_bought = True)
        for i in our_products:
            total_amount += i.product.price * i.quantity
            ovrall_quantity += i.quantity

        # for every product info
        final_products = Product.objects.filter(quantity_sold__gt = 0)
        product_sales_data = []   # Gather product sales data (number of sales and earnings for each product)
        for product  in final_products:
            number_of_sales = product .quantity_sold
            earnings = product.price * number_of_sales
            product_sales_data.append({
                'product': product.name,
                'number_of_sales': number_of_sales,
                'earnings': earnings
            })
        sorted_by_earnings = sorted(product_sales_data, key=lambda x: x['earnings'], reverse=False) #  "For each dictionary in the list, use the value of the 'earnings' key as the basis for sorting."
        sorted_by_quantity = sorted(product_sales_data, key=lambda x: x['number_of_sales'], reverse=False)


        # customer info
        our_customers = Customer.objects.filter(history__isnull=False).annotate(
            total_spent=Sum(F('history__price') * F('history__quantity'))).order_by('total_spent')

        customer_data = []
        for customer in our_customers:
            products_purchased = []
            for product in customer.history.all():
                products_purchased.append({
                    'product': product.name,
                    'quantity': product.quantity
                })
            customer_data.append({
                'customer': customer.name,
                "quantity_bought": customer.quantity_bought,
                "how_much_is_bought": customer.how_much_bought,
                'products_purchased': products_purchased,
                'total_spent': customer.total_spent
            })

        # every employee + manager: how many products(ovrall) + total earnings + what products and how many + sort by most earnings 
        employees = Employee.objects.all()
        employee_sales_data = []

        for employee in employees:
            # Get all products sold by this employee
            products_sold = EmployeeRelationToProduct.objects.filter(seller=employee)

            # Calculate total earnings & total quantity sold
            total_earnings = sum(p.product.price * p.quantity for p in products_sold)
            total_products_sold = sum(p.quantity for p in products_sold)

            # Gather product details
            products_details = []
            for p in products_sold:
                products_details.append({
                    "product": p.product.name,
                    "quantity_sold": p.quantity,
                    "earnings": p.product.price * p.quantity
                })

            employee_sales_data.append({
                "employee": employee.user.username,
                "total_earnings": total_earnings,
                "total_products_sold": total_products_sold,
                "products": products_details
            })

        # Sort employees by total earnings (descending)
        sorted_employees = sorted(employee_sales_data, key=lambda x: x["total_earnings"], reverse=False)


        # Response data construction
        data = {
            'total_earnings': total_amount,
            'overall_quantity_sold': ovrall_quantity,
            'sorted_by_earnings': sorted_by_earnings,
            'sorted_by_quantity': sorted_by_quantity,
            'customer_data': customer_data,
            "sorted_employees": sorted_employees
        }

        return Response(data)
 """

class DeleteFireEmployee(generics.DestroyAPIView):
    queryset = Employee.objects.all()
    permission_classes = [IsManager]

    def perform_destroy(self, instance):
        if instance.user == self.request.user:  
            raise ValidationError({"detail": "You cannot delete your own account."})

        user = instance.user
        print(f"Deleting User {user.username} related to Employee {instance.id}.")
        user.delete()
        print(f"Employee {instance.id} ({instance.user}) has been deleted by {self.request.user.username}.")
        super().perform_destroy(instance)


class ListUsers(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsManager] 

class ListEmployees(generics.ListAPIView):
    queryset = Employee.objects.all()
    serializer_class = Employeeserializers
    permission_classes = [IsManager]




















