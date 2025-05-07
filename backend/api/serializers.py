from django.contrib.auth.models import User
from rest_framework import serializers
from .models import CustomerRelationToProduct, Product, Employee, Manager, Customer, Profile, Comment, ManagerRelationToProduct, EmployeeRelationToProduct

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user_type']
    
    def validate_user_type(self, value):
        valid_types = {"Customer", "Employee", "Manager"}
        if value not in valid_types:
            raise serializers.ValidationError("Invalid user type")
        return value

class UserSerializer(serializers.ModelSerializer):
    profile_user = ProfileSerializer(required=True)  # ✅ Required field

    class Meta:
        model = User
        fields = ["id", "username", "password", "profile_user"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile_user')
        user = User.objects.create_user(**validated_data)
        
        # Create profile using the serializer
        Profile.objects.create(user=user, **profile_data)  # ✅ Safe (already validated)
        
        return user

class Employeeserializers(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    class Meta:
        model = Employee
        fields = ["id", "user", "joined_at", "amount", "history", "username"]
        extra_kwargs = {"password" : {"write_only": True}}

class Managerserializers(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Manager
        fields = ["id", "user", "joined_at", "amount", "history", "username"]
        read_only_fields = ['user']

class Customerserializers(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)  
    email = serializers.EmailField(source="user.email")  

    class Meta:
        model = Customer
        fields = ["id", "user", "username", "email", "joined_at", "amount", "products_in_basket", "history", "charge"]
        read_only_fields = ['user']        

class ProductSerializer(serializers.ModelSerializer):
    seller = serializers.CharField(source='seller.username', read_only=True,)  
    class Meta:
        model = Product
        fields = ["id", "name", "seller", "created_at", "price", "description", "picture","rating", "number_of_ratings", "new_rating", 'quantity_sold' ]
        extra_kwargs = {"seller" : {"read_only" : True}} 

class CustomerRelationToProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')
    quantity = serializers.IntegerField()    
    product_id = serializers.IntegerField(source='product.id') 
    product_price = serializers.DecimalField(source='product.price', decimal_places=2, max_digits=10)  
    product_seller = serializers.CharField(source='product.seller', read_only=True)  
    created_at = serializers.DateTimeField(source='product.created_at', read_only=True)
    picture = serializers.ImageField(source='product.picture', read_only=True)
    class Meta:
        model = CustomerRelationToProduct
        fields = ['id', 'product_name', 'quantity', 'product_id', 'product_price', 'product_seller', 'created_at', 'picture']

class CommentSerializer(serializers.ModelSerializer):
     written_by = serializers.CharField(source = "written_by.user.username", read_only = True)
     the_product = serializers.CharField(source = "the_product.name", read_only = True)

     class Meta:
          model = Comment
          fields = ["content", "created_at", "written_by", "the_product"]

class UpdateAmountSerializer(serializers.Serializer):
    increament = serializers.IntegerField()

    def validate_incraement(self, value):
        if value < 0:
                        raise serializers.ValidationError("Increment value must be positive.")
        return value

class ManagerRelationToProductSerializer(serializers.ModelSerializer):
    picture = serializers.ImageField(source='product.picture', read_only=True)
    product_name = serializers.CharField(source='product.name')
    product_price = serializers.DecimalField(source='product.price', decimal_places=2, max_digits=10) 
    created_at = serializers.DateTimeField(source='product.created_at', read_only=True)
    quantity = serializers.IntegerField()    
    
    class Meta:
        model = ManagerRelationToProduct
        fields = ['product_name', 'quantity', 'product_price', 'created_at', 'picture']

class EmployeeRelationToProductSerializer(serializers.ModelSerializer):
    picture = serializers.ImageField(source='product.picture', read_only=True)
    product_name = serializers.CharField(source='product.name')
    quantity = serializers.IntegerField() 
    product_price = serializers.DecimalField(source='product.price', decimal_places=2, max_digits=10) 
    created_at = serializers.DateTimeField(source='product.created_at', read_only=True)   
    
    class Meta:
        model = EmployeeRelationToProduct
        fields = ['product_name', 'quantity','product_price', 'created_at', 'picture']

class RatingProductSerializer(serializers.Serializer):
     class Meta:
        model = Product
        fields = ["rating"]
     











""" class RateProductSerializer(serializers.Serializer):
     stars = serializers.IntegerField()

     def validate_stars(self, value):
          if value > 5 or value < 0:
                raise serializers.ValidationError("rating value must be from 0 to 5.")
          return value

                """
























